import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { query } from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import crypto from 'crypto';
import { randomBytes } from 'crypto';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=Strict; Secure;`;
};

const createPasswordResetToken = (email: string): { token: string; expiresAt: Date } => {
  const resetToken = randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expires in 10 minutes
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  return { token: resetToken, expiresAt };
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<User> {
    const { email, password } = userData;

    const { rows: findUser } = await query(
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
    if (findUser[0].exists) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: signUpUserData } = await query(
      `
      INSERT INTO
        users(
          "email",
          "password"
        )
      VALUES ($1, $2)
      RETURNING "email", "password", "id"
      `,
      [email, hashedPassword],
    );

    return signUpUserData[0];
  }

  public async login(loginData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    const { email, password } = loginData;

    const { rows, rowCount } = await query(
      `
      SELECT
        "email",
        "password",
        "id"
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );
    if (!rowCount) throw new HttpException(409, `This email ${email} was not found`);

    const isPasswordMatching: boolean = await compare(password, rows[0].password);
    if (!isPasswordMatching) throw new HttpException(409, 'Your password is not matching');

    const tokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);

    // Remove the password from the user object before returning it
    const userWithoutPassword = { ...rows[0] };
    delete userWithoutPassword.password;

    return { cookie, findUser: userWithoutPassword };
  }

  public async logout(userData: User): Promise<User> {
    const { email, password } = userData;

    const { rows, rowCount } = await query(
      `
    SELECT
        "email",
        "password"
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );
    if (!rowCount) throw new HttpException(409, "User doesn't exist");

    // Password verification should be done when necessary
    if (password) {
      const isPasswordMatching: boolean = await compare(password, rows[0].password);
      if (!isPasswordMatching) throw new HttpException(409, 'Your password is not matching');
    }

    return rows[0];
  }

  public async requestPasswordReset(passwordResetData: RequestPasswordResetDto): Promise<{ message: string }> {
    const { email } = passwordResetData;

    // Check if user exists
    const { rows, rowCount } = await query(
      `
      SELECT
        "id",
        "email"
      FROM
        users
      WHERE
        "email" = $1
    `,
      [email],
    );

    if (!rowCount) {
      throw new HttpException(409, `User with email ${email} not found`);
    }

    // Generate reset token
    const { token, expiresAt } = createPasswordResetToken(email);

    // Store hashed token in database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // First, delete any existing reset tokens for this user
    await query(
      `
      DELETE FROM
        password_reset_tokens
      WHERE
        "user_id" = $1
      `,
      [rows[0].id],
    );

    // Then, insert new reset token
    await query(
      `
      INSERT INTO
        password_reset_tokens(
          "user_id",
          "token",
          "expires_at"
        )
      VALUES ($1, $2, $3)
      `,
      [rows[0].id, hashedToken, expiresAt],
    );

    // In a real application, this would send an email with the reset link
    // For this implementation, we'll just return a success message
    // The actual token would be sent in an email in a production environment

    return {
      message: `Password reset link has been sent to ${email}. In a production environment, the link would contain: ${token}`,
    };
  }

  public async resetPassword(resetData: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetData;

    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Get token record and associated user
    const { rows: tokenRows, rowCount: tokenCount } = await query(
      `
      SELECT
        t."user_id",
        t."expires_at"
      FROM
        password_reset_tokens t
      WHERE
        t."token" = $1
        AND t."expires_at" > NOW()
      `,
      [hashedToken],
    );

    if (!tokenCount) {
      throw new HttpException(409, 'Invalid or expired password reset token');
    }

    const userId = tokenRows[0].user_id;

    // Get user details
    const { rows: userRows, rowCount: userCount } = await query(
      `
      SELECT
        "id",
        "email"
      FROM
        users
      WHERE
        "id" = $1
      `,
      [userId],
    );

    if (!userCount) {
      throw new HttpException(409, 'User not found');
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user's password
    await query(
      `
      UPDATE
        users
      SET
        "password" = $1,
        "updated_at" = NOW()
      WHERE
        "id" = $2
      `,
      [hashedPassword, userId],
    );

    // Delete used token
    await query(
      `
      DELETE FROM
        password_reset_tokens
      WHERE
        "user_id" = $1
      `,
      [userId],
    );

    return { message: 'Password has been reset successfully' };
  }

  // Development-only method to retrieve a password reset token
  public async getResetTokenForDev(email: string): Promise<string | null> {
    try {
      // Get user id for the email
      const { rows: userRows, rowCount: userCount } = await query(
        `
        SELECT
          "id"
        FROM
          users
        WHERE
          "email" = $1
        `,
        [email],
      );

      if (!userCount) {
        return null;
      }

      const userId = userRows[0].id;

      // Get the most recent token for this user
      const { rows: tokenRows, rowCount: tokenCount } = await query(
        `
        SELECT
          "token",
          "created_at"
        FROM
          password_reset_tokens
        WHERE
          "user_id" = $1
        ORDER BY
          "created_at" DESC
        LIMIT 1
        `,
        [userId],
      );

      if (!tokenCount) {
        return null;
      }

      // For development, we need to unhash/retrieve the actual token
      // In a real app, this wouldn't be possible as we only store the hash
      // Instead, we'll generate a new token specifically for development testing

      const { token, expiresAt } = createPasswordResetToken(email);

      // Update the existing token entry with our new generated token
      // This is only for development testing - in production we'd never do this
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      await query(
        `
        UPDATE
          password_reset_tokens
        SET
          "token" = $1,
          "expires_at" = $2
        WHERE
          "user_id" = $3
        `,
        [hashedToken, expiresAt, userId],
      );

      // Return the unhashed token for testing
      return token;
    } catch (error) {
      console.error('Error retrieving development reset token:', error);
      return null;
    }
  }
}
