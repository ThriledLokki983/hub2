import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { UserService } from '@services/users.service';
import { HttpException } from '@exceptions/httpException';
import { apiResponse } from '@utils/responseFormatter';
import { HttpStatusCodes } from '@utils/httpStatusCodes';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: Omit<User, 'password'>[] = await this.user.findAllUsers();

      apiResponse.success(res, 'Users retrieved successfully', findAllUsersData, { count: findAllUsersData.length });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const findOneUserData: Omit<User, 'password'> = await this.user.findUserById(userId);

      apiResponse.success(res, 'User retrieved successfully', findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: Omit<User, 'password'> = await this.user.createUser(userData);

      apiResponse.created(res, 'User created successfully', createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: UpdateUserDto = req.body;
      const updateUserData: Omit<User, 'password'> = await this.user.updateUser(userId, userData);

      apiResponse.success(res, 'User updated successfully', updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const deleteUserData: Omit<User, 'password'> = await this.user.deleteUser(userId);

      apiResponse.success(res, 'User deleted successfully', deleteUserData);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const userId = req.user.id;
      const findUserData: Omit<User, 'password'> = await this.user.findUserById(userId);

      apiResponse.success(res, 'Current user retrieved', findUserData);
    } catch (error) {
      next(error);
    }
  };

  public uploadUserPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const file = req.file;

      if (!file) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'No photo file uploaded');
      }

      // Create the base URL for the uploaded file
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // First, check if user already has a photo to delete existing variants
      const photoInfo = await this.user.getUserPhotoInfo(userId);

      // Upload and process the new photo with multiple size variants
      const updatedUser = await this.user.updateUserPhotoWithVariants(userId, file, baseUrl);

      apiResponse.success(res, 'User photo uploaded and processed successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public updateUserPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const file = req.file;

      if (!file) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'No photo file uploaded');
      }

      // Create the base URL for the uploaded file
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // First get the current photo info to delete later
      const photoInfo = await this.user.getUserPhotoInfo(userId);

      // Process and save the new image with variants
      const updatedUser = await this.user.updateUserPhotoWithVariants(userId, file, baseUrl);

      // If we previously had a photo, we need to remove the old files
      if (photoInfo.variants) {
        // We'll delete old files in the background without waiting
        try {
          const fs = require('fs').promises;
          const path = require('path');

          // Delete all previous variants to save space
          for (const variant of Object.values(photoInfo.variants)) {
            const urlParts = new URL(variant.url);
            const filePath = path.join(process.cwd(), urlParts.pathname.slice(1));

            // No need to await, we do this asynchronously
            fs.access(filePath)
              .then(() => fs.unlink(filePath))
              .catch(err => console.warn(`Error deleting previous photo variant: ${err.message}`));
          }
        } catch (fsError) {
          console.error('Error during cleanup of previous photo files:', fsError);
          // We don't throw here because the update was already successful
        }
      }

      apiResponse.success(res, 'User photo updated and processed successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteUserPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;

      // Remove the photo and all its variants from storage and database
      const updatedUser = await this.user.removeUserPhotoWithVariants(userId);

      apiResponse.success(res, 'User photo and all variants deleted successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };
}
