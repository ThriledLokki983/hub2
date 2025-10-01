import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { query } from '@database';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const { rows } = await query(`
    SELECT
      id, first_name, last_name, middle_name, full_name, email, image, title, region, created_at, updated_at
    FROM
      users
    `);
    return rows;
  }

  public async findUserById(userId: string): Promise<User> {
    const { rows, rowCount } = await query(
      `
    SELECT
      id, first_name, last_name, middle_name, full_name, email, image, title, region, created_at, updated_at
    FROM
      users
    WHERE
      id = $1
    `,
      [userId],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    return rows[0];
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const { email, password, first_name, last_name, middle_name, title, region, image } = userData;

    // Generate full name from first, middle, and last names if not provided
    const full_name = userData.full_name || `${first_name}${middle_name ? ' ' + middle_name : ''} ${last_name}`;

    const { rows } = await query(
      `
    SELECT EXISTS(
      SELECT
        "email"
      FROM
        users
      WHERE
        "email" = $1
    )`,
      [email],
    );
    if (rows[0].exists) throw new HttpException(409, `This email ${email} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: createUserData } = await query(
      `
      INSERT INTO
        users(
          "first_name",
          "last_name",
          "middle_name",
          "full_name",
          "email",
          "password",
          "image",
          "title",
          "region"
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, first_name, last_name, middle_name, full_name, email, image, title, region, created_at, updated_at
      `,
      [first_name, last_name, middle_name, full_name, email, hashedPassword, image, title, region],
    );

    return createUserData[0];
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    const { rows: findUser } = await query(
      `
      SELECT EXISTS(
        SELECT
          "id"
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    // Get current user data to merge with updates
    const { rows: currentUser } = await query(
      `
      SELECT
        first_name, last_name, middle_name, full_name, email, password, image, title, region
      FROM
        users
      WHERE
        id = $1
      `,
      [userId],
    );

    const {
      first_name = currentUser[0].first_name,
      last_name = currentUser[0].last_name,
      middle_name = currentUser[0].middle_name,
      title = currentUser[0].title,
      region = currentUser[0].region,
      image = currentUser[0].image,
      password,
    } = userData;

    // Generate updated full name if any name component has changed
    const full_name = userData.full_name || `${first_name}${middle_name ? ' ' + middle_name : ''} ${last_name}`;

    // Only hash password if it's being updated
    let hashedPassword = currentUser[0].password;
    if (password) {
      hashedPassword = await hash(password, 10);
    }

    const { rows: updateUserData } = await query(
      `
      UPDATE
        users
      SET
        "first_name" = $2,
        "last_name" = $3,
        "middle_name" = $4,
        "full_name" = $5,
        "password" = $6,
        "image" = $7,
        "title" = $8,
        "region" = $9,
        "updated_at" = CURRENT_TIMESTAMP
      WHERE
        "id" = $1
      RETURNING id, first_name, last_name, middle_name, full_name, email, image, title, region, created_at, updated_at
    `,
      [userId, first_name, last_name, middle_name, full_name, hashedPassword, image, title, region],
    );

    return updateUserData[0];
  }

  public async deleteUser(userId: string): Promise<User> {
    const { rows: findUser } = await query(
      `
      SELECT EXISTS(
        SELECT
          "id"
        FROM
          users
        WHERE
          "id" = $1
      )`,
      [userId],
    );
    if (!findUser[0].exists) throw new HttpException(409, "User doesn't exist");

    const { rows: deleteUserData } = await query(
      `
      DELETE
      FROM
        users
      WHERE
        id = $1
      RETURNING id, first_name, last_name, middle_name, full_name, email, image, title, region, created_at, updated_at
      `,
      [userId],
    );

    return deleteUserData[0];
  }
}
