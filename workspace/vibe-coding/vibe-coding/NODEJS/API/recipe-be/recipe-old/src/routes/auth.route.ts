import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { SignupUserDtoType, LoginUserDtoType } from '../dto/user.dto';
import { Routes } from '../interfaces/routes.interface';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { validateMiddleware } from '../middlewares/validation.middleware';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *     SignupUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 100
 *           description: User's password (min 8 characters)
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 100
 *           description: User's password
 */

class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();
  public path = '/auth';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupUserDto'
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input data
     *       409:
     *         description: Email already exists
     */
    this.router.post(
      `${this.path}/signup`,
      validateMiddleware(SignupUserDtoType, 'body'),
      this.auth.signUp
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login user and get authentication token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginUserDto'
     *     responses:
     *       200:
     *         description: Login successful
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: Authorization=abcde12345; HttpOnly; Max-Age=3600
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid input data
     *       409:
     *         description: Email not found or password incorrect
     */
    this.router.post(
      `${this.path}/login`,
      validateMiddleware(LoginUserDtoType, 'body'),
      this.auth.logIn
    );

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Logout user by clearing authentication token
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: Authorization=; Max-Age=0
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized - authentication required
     */
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.auth.logOut);

    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Get current user profile
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized - authentication required
     */
    this.router.get(`${this.path}/me`, AuthMiddleware, this.auth.getProfile);

    /**
     * @swagger
     * /auth/users:
     *   get:
     *     summary: Get all users (for testing purposes)
     *     tags: [Authentication]
     *     responses:
     *       200:
     *         description: List of all users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 users:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *                 length:
     *                   type: integer
     *                 message:
     *                   type: string
     */
    this.router.get(`${this.path}/users`, this.auth.getAllUsers);

    /**
     * @swagger
     * /auth/verify-token:
     *   get:
     *     summary: Check if user is authenticated by verifying the token
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Token is valid
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 isAuthenticated:
     *                   type: boolean
     *                   example: true
     *                 user:
     *                   type: object
     *                   properties:
     *                     email:
     *                       type: string
     *                       format: email
     *                 message:
     *                   type: string
     *                   example: Token is valid
     *       401:
     *         description: Unauthorized - invalid or expired token
     *       404:
     *         description: Authorization token missing
     */
    this.router.get(`${this.path}/verify-token`, AuthMiddleware, this.auth.verifyToken);

    /**
     * @swagger
     * /auth/random-user:
     *   post:
     *     summary: Create a random user based on recipe data
     *     tags: [Authentication]
     *     responses:
     *       201:
     *         description: Random user created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error
     */
    this.router.post(`${this.path}/random-user`, this.auth.createRandomUser);
  }
}

export default AuthRoute;
