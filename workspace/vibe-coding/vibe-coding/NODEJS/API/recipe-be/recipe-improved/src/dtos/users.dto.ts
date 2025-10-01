import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *       properties:
 *         first_name:
 *           type: string
 *           description: User's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         middle_name:
 *           type: string
 *           description: User's middle name
 *           example: Michael
 *         full_name:
 *           type: string
 *           description: User's full name
 *           example: John Michael Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 9
 *           maxLength: 32
 *           description: User's password (min 9 chars, max 32 chars)
 *           example: password123
 *         image:
 *           type: string
 *           description: URL to user's profile image
 *           example: https://example.com/images/profile.jpg
 *         title:
 *           type: string
 *           description: User's title or position
 *           example: Software Engineer
 *         region:
 *           type: string
 *           description: User's region or location
 *           example: North America
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsString()
  @IsOptional()
  public middle_name?: string;

  @IsString()
  @IsOptional()
  public full_name?: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public region?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: User's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         middle_name:
 *           type: string
 *           description: User's middle name
 *           example: Michael
 *         full_name:
 *           type: string
 *           description: User's full name
 *           example: John Michael Doe
 *         password:
 *           type: string
 *           format: password
 *           minLength: 9
 *           maxLength: 32
 *           description: User's new password (min 9 chars, max 32 chars)
 *           example: newpassword123
 *         image:
 *           type: string
 *           description: URL to user's profile image
 *           example: https://example.com/images/profile.jpg
 *         title:
 *           type: string
 *           description: User's title or position
 *           example: Software Engineer
 *         region:
 *           type: string
 *           description: User's region or location
 *           example: North America
 */
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public first_name?: string;

  @IsString()
  @IsOptional()
  public last_name?: string;

  @IsString()
  @IsOptional()
  public middle_name?: string;

  @IsString()
  @IsOptional()
  public full_name?: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password?: string;

  @IsString()
  @IsOptional()
  public image?: string;

  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public region?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *           example: 1
 *         first_name:
 *           type: string
 *           description: User's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         middle_name:
 *           type: string
 *           description: User's middle name
 *           example: Michael
 *         full_name:
 *           type: string
 *           description: User's full name
 *           example: John Michael Doe
 *         email:
 *           type: string
 *           description: User's email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: User's hashed password
 *           example: $2b$10$TBEfaCe8O/nCXiHjhfHGOu3PGa4EWnC8N2hN34S8hd/LOMjTxZa4i
 *         image:
 *           type: string
 *           description: URL to user's profile image
 *           example: https://example.com/images/profile.jpg
 *         title:
 *           type: string
 *           description: User's title or position
 *           example: Software Engineer
 *         region:
 *           type: string
 *           description: User's region or location
 *           example: North America
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was last updated
 *       required:
 *         - email
 *         - password
 */
