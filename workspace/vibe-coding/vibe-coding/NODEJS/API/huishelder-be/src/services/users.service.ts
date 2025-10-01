import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@dtos/users.dto';
import { DbHelper } from '@utils/dbHelper';
import { PoolClient } from 'pg';
import { SqlHelper } from '@utils/sqlHelper';
import { HttpStatusCodes } from '@utils/httpStatusCodes';
import { CacheHelper } from '@utils/cacheHelper';
import { PhotoMetadata, PhotoVariant } from '@interfaces/users.interface';
import { ImageProcessor, ProcessedImage } from '@utils/imageProcessing';
import fs from 'fs/promises';
import path from 'path';

@Service()
export class UserService {
  // Cache key prefixes for better organization and pattern-based invalidation
  private readonly CACHE_PREFIX = 'users';
  private readonly CACHE_ALL_USERS = `${this.CACHE_PREFIX}:all`;
  private readonly CACHE_USER_BY_ID = `${this.CACHE_PREFIX}:id:`;

  // Cache TTLs (in seconds)
  private readonly CACHE_TTL = {
    USER_LIST: 5 * 60, // 5 minutes for user lists
    USER_DETAIL: 10 * 60, // 10 minutes for individual users
  };

  /**
   * Find all users with caching
   */
  public async findAllUsers(): Promise<UserResponseDto[]> {
    return CacheHelper.getOrSet<UserResponseDto[]>(
      this.CACHE_ALL_USERS,
      async () => {
        const { rows } = await DbHelper.query(SqlHelper.getUserSelectQuery());
        return rows;
      },
      { ttl: this.CACHE_TTL.USER_LIST },
    );
  }

  /**
   * Find user by ID with caching
   */
  public async findUserById(userId: string): Promise<UserResponseDto> {
    return CacheHelper.getOrSet<UserResponseDto>(
      `${this.CACHE_USER_BY_ID}${userId}`,
      async () => {
        const {
          rows: [user],
        } = await DbHelper.query(SqlHelper.getUserByIdQuery(), [userId]);

        if (!user) {
          throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
        }

        return user;
      },
      { ttl: this.CACHE_TTL.USER_DETAIL },
    );
  }

  /**
   * Create user and invalidate related caches
   */
  public async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name, first_name, last_name, phone, address, role, language_preference, is_active } = userData;

    // Using transaction to ensure atomicity
    const newUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Check if email already exists
      const {
        rows: [{ exists }],
      } = await DbHelper.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND deleted_at IS NULL)`, [email], client);

      if (exists) {
        throw new HttpException(HttpStatusCodes.CONFLICT, `This email ${email} already exists`);
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Insert user
      const {
        rows: [newUser],
      } = await DbHelper.query(
        SqlHelper.getInsertUserQuery(),
        [email, hashedPassword, name, first_name, last_name, phone, address, role, language_preference, is_active],
        client,
      );

      return newUser;
    });

    // Invalidate all users cache since we added a new user
    await this.invalidateUserCaches();

    return newUser;
  }

  /**
   * Update user and invalidate related caches
   */
  public async updateUser(userId: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    // Using transaction to ensure atomicity of the update operation
    const updatedUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Step 1: Fetch current user
      const {
        rows: [currentUser],
      } = await DbHelper.query(SqlHelper.getUserByIdQuery(true), [userId], client);

      if (!currentUser) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      // Step 2: Merge incoming data with existing data
      const {
        email = currentUser.email,
        name = currentUser.name,
        first_name = currentUser.first_name,
        last_name = currentUser.last_name,
        phone = currentUser.phone,
        address = currentUser.address,
        role = currentUser.role,
        language_preference = currentUser.language_preference,
        is_active = currentUser.is_active,
        password,
      } = userData;

      // If the email is being changed, check if the new email already exists
      if (email !== currentUser.email) {
        const {
          rows: [{ exists }],
        } = await DbHelper.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id != $2 AND deleted_at IS NULL)`, [email, userId], client);

        if (exists) {
          throw new HttpException(HttpStatusCodes.CONFLICT, `This email ${email} already exists`);
        }
      }

      const hashedPassword = password ? await hash(password, 10) : currentUser.password;

      // Step 3: Update the user
      const {
        rows: [updatedUser],
      } = await DbHelper.query(
        SqlHelper.getUpdateUserQuery(),
        [userId, email, name, first_name, last_name, phone, address, role, language_preference, hashedPassword, is_active],
        client,
      );

      return updatedUser;
    });

    // Invalidate affected caches
    await Promise.all([CacheHelper.invalidate(`${this.CACHE_USER_BY_ID}${userId}`), CacheHelper.invalidate(this.CACHE_ALL_USERS)]);

    return updatedUser;
  }

  /**
   * Delete user and invalidate related caches
   */
  public async deleteUser(userId: string): Promise<UserResponseDto> {
    // Using transaction for consistency
    const deletedUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Using soft delete by setting deleted_at timestamp
      const {
        rows: [deletedUser],
      } = await DbHelper.query(SqlHelper.getSoftDeleteUserQuery(), [userId], client);

      if (!deletedUser) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      return deletedUser;
    });

    // Invalidate affected caches
    await this.invalidateUserCaches(userId);

    return deletedUser;
  }

  /**
   * Update user photo with multiple size variants
   * @param userId User ID
   * @param file Uploaded file from multer
   * @param baseUrl Base URL for serving images
   */
  public async updateUserPhotoWithVariants(userId: string, file: Express.Multer.File, baseUrl: string): Promise<UserResponseDto> {
    // Using transaction to ensure atomicity
    const userWithUpdatedPhoto = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Verify user exists
      const {
        rows: [user],
      } = await DbHelper.query(SqlHelper.getUserByIdQuery(), [userId], client);

      if (!user) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      // Create image processor
      const imageProcessor = new ImageProcessor();

      // Process image to create different sizes
      const processedImage = await imageProcessor.processImage(file, baseUrl);

      // Extract metadata for the original image
      const metadata: PhotoMetadata = {
        width: processedImage.sizes.original.width,
        height: processedImage.sizes.original.height,
        format: processedImage.sizes.original.format,
        size: processedImage.sizes.original.size,
        aspectRatio: processedImage.sizes.original.width / processedImage.sizes.original.height,
      };

      // Create a map of variants for database storage
      const variants: Record<string, PhotoVariant> = {};
      for (const [key, info] of Object.entries(processedImage.sizes)) {
        variants[key] = {
          url: info.url,
          width: info.width,
          height: info.height,
          format: info.format,
          size: info.size,
        };
      }

      // Update photo information in database
      const {
        rows: [updatedUser],
      } = await DbHelper.query(
        SqlHelper.getUpdateUserPhotoQuery(),
        [
          userId,
          processedImage.sizes.original.url,
          processedImage.originalFilename,
          file.mimetype,
          JSON.stringify(variants),
          JSON.stringify(metadata),
        ],
        client,
      );

      return { updatedUser, processedImage };
    });

    // Invalidate affected caches
    await this.invalidateUserCaches(userId);

    return userWithUpdatedPhoto.updatedUser;
  }

  /**
   * Remove user photo including all size variants
   * @param userId User ID
   */
  public async removeUserPhotoWithVariants(userId: string): Promise<UserResponseDto> {
    // Using transaction to ensure atomicity
    const userWithRemovedPhoto = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Verify user exists
      const {
        rows: [user],
      } = await DbHelper.query(SqlHelper.getUserByIdQuery(), [userId], client);

      if (!user) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      // Get current photo variants for potential file deletion
      const photoVariants = user.photo_variants;

      // Remove photo information from database
      const {
        rows: [updatedUser],
      } = await DbHelper.query(SqlHelper.getRemoveUserPhotoQuery(), [userId], client);

      return { updatedUser, photoVariants };
    });

    // Delete the actual files if they exist
    if (userWithRemovedPhoto.photoVariants) {
      try {
        // Delete all image variants
        const variants = userWithRemovedPhoto.photoVariants;
        for (const variant of Object.values(variants)) {
          const urlParts = new URL(variant.url);
          const filePath = path.join(process.cwd(), urlParts.pathname.slice(1)); // Remove leading slash

          try {
            await fs.access(filePath);
            await fs.unlink(filePath);
          } catch (fileError) {
            console.warn(`Could not delete file at ${filePath}: ${fileError.message}`);
          }
        }
      } catch (error) {
        console.error('Error deleting photo files:', error);
        // We don't throw here because the database update was already successful
      }
    }

    // Invalidate affected caches
    await this.invalidateUserCaches(userId);

    return userWithRemovedPhoto.updatedUser;
  }

  /**
   * Get user's current photo variants information
   * @param userId User ID
   */
  public async getUserPhotoInfo(userId: string): Promise<{ filename?: string; variants?: Record<string, PhotoVariant> }> {
    const {
      rows: [user],
    } = await DbHelper.query(`SELECT photo_filename, photo_variants FROM users WHERE id = $1 AND deleted_at IS NULL`, [userId]);

    return user
      ? {
          filename: user.photo_filename,
          variants: user.photo_variants,
        }
      : {};
  }

  /**
   * Get user's current photo filename
   * @param userId User ID
   */
  public async getUserPhotoFilename(userId: string): Promise<string | null> {
    const {
      rows: [user],
    } = await DbHelper.query(`SELECT photo_filename FROM users WHERE id = $1 AND deleted_at IS NULL`, [userId]);

    return user ? user.photo_filename : null;
  }

  /**
   * Helper method to invalidate user-related caches
   * @param userId Optional user ID to invalidate specific user cache
   */
  private async invalidateUserCaches(userId?: string): Promise<void> {
    const promises: Promise<boolean>[] = [CacheHelper.invalidate(this.CACHE_ALL_USERS)];

    if (userId) {
      promises.push(CacheHelper.invalidate(`${this.CACHE_USER_BY_ID}${userId}`));
    }

    await Promise.all(promises);
  }
}
