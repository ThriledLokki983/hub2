import { hash, compare } from 'bcrypt';
import { Service } from 'typedi';
import { SECRET_TOKEN } from '../config';
import pg from '../database';
import { client } from '../database';
import { sign } from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { HttpException } from '../exceptions/httpException';
import { LoginUserDto, SignupUserDto } from '../dto/user.dto';
import crypto from 'crypto';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60; // 1 hour

  return {
    expiresIn,
    token: sign(dataStoredInToken, SECRET_TOKEN || 'test', { expiresIn }),
  };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: SignupUserDto): Promise<User> {
    const { name, email, password } = userData;

    const { rows: findUser } = await pg.query(
      `SELECT EXISTS(
        SELECT
          "email" FROM "users" WHERE email = $1
      ) as exists`,
      [email]
    );

    if (findUser[0].exists) {
      throw new HttpException(409, 'Email already exists');
    }

    const hashedPassword = await hash(password, 10);
    const userId = crypto.randomUUID();
    const currentDate = new Date();

    const { rows: signUpUserData } = await pg.query(
      `INSERT INTO
        users(id, name, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, email, hashedPassword, currentDate, currentDate]
    );

    return signUpUserData[0];
  }

  public async login(
    userData: LoginUserDto
  ): Promise<{ cookie: string; user: Omit<User, 'password'> }> {
    const { email, password } = userData;

    const { rows, rowCount } = await pg.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rowCount === 0) {
      throw new HttpException(409, 'Email not found');
    }

    const isPasswordMatching = await compare(password, rows[0].password);

    if (!isPasswordMatching) {
      throw new HttpException(409, 'Password is incorrect');
    }

    const tokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);

    // Create a new object without the password
    const { password: _password, ...userWithoutPassword } = rows[0];

    return { cookie, user: userWithoutPassword as Omit<User, 'password'> };
  }

  public async logout(user: User): Promise<Omit<User, 'password'>> {
    const { email } = user;

    const { rows, rowCount } = await pg.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rowCount === 0) {
      throw new HttpException(409, 'User not found');
    }

    // Create a new object without the password
    const { password: _password, ...userWithoutPassword } = rows[0];

    return userWithoutPassword as Omit<User, 'password'>;
  }

  public async getCurrentUser(
    userEmail: string
  ): Promise<Omit<User, 'password'>> {
    const { rows, rowCount } = await pg.query(
      `SELECT * FROM users WHERE email = $1`,
      [userEmail]
    );

    if (rowCount === 0) {
      throw new HttpException(404, 'User not found');
    }

    // Create a new object without the password
    const { password: _password, ...userWithoutPassword } = rows[0];
    return userWithoutPassword as Omit<User, 'password'>;
  }

  public async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const { rows, rowCount } = await pg.query(
      `SELECT * FROM users ORDER BY "created_at" DESC`
    );

    if (rowCount === 0) {
      return [];
    }

    // Remove passwords from all user objects
    return rows.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword as Omit<User, 'password'>;
    });
  }

  /**
   * Creates a random user based on recipe data
   * Generates a user with name and email derived from a random recipe title
   */
  public async createRandomUserFromRecipe(): Promise<Omit<User, 'password'>> {
    try {
      // Get a random recipe title to use for generating user data
      const { rows: recipeRows } = await client.query(
        'SELECT title FROM recipes ORDER BY RANDOM() LIMIT 1'
      );

      if (recipeRows.length === 0) {
        throw new HttpException(
          404,
          'No recipes found to generate user data from'
        );
      }

      const recipeTitle = recipeRows[0].title;
      // Generate a chef name from the recipe title
      const name = `Chef ${recipeTitle}`;

      // Create an email from the recipe title (remove special chars, lowercase)
      const emailPrefix = recipeTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `chef_${emailPrefix}@example.com`;

      // Generate a secure password
      const password = await hash('recipe123', 10);
      const userId = crypto.randomUUID();
      const currentDate = new Date();

      const { rows: signUpUserData } = await client.query(
        `INSERT INTO
          users(id, name, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, name, email, password, currentDate, currentDate]
      );

      // Return without password
      const { password: _password, ...userWithoutPassword } = signUpUserData[0];
      return userWithoutPassword as Omit<User, 'password'>;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        500,
        `Error creating random user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
