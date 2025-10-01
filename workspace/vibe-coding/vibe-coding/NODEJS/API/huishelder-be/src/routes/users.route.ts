import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { uploadMiddleware } from '@middlewares/upload.middleware';

// Create type-safe wrapper for combining middlewares
const combineMiddlewares = (...middlewares: any[]) => middlewares;

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Place the /me route BEFORE the /:id route to ensure it's not treated as a UUID parameter
    this.router.get(`${this.path}/me`, AuthMiddleware, this.user.getCurrentUser);
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto, 'body'), this.user.createUser);
    this.router.put(
      `${this.path}/:id`,
      ValidationMiddleware(CreateUserDto, 'body', {
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
      this.user.updateUser,
    );
    this.router.delete(`${this.path}/:id`, this.user.deleteUser);

    // New photo upload routes with combined middlewares
    const photoMiddlewares = combineMiddlewares(AuthMiddleware, uploadMiddleware.single('photo'));
    this.router.post(`${this.path}/:id/photo`, ...photoMiddlewares, this.user.uploadUserPhoto);
    this.router.put(`${this.path}/:id/photo`, ...photoMiddlewares, this.user.updateUserPhoto);
    this.router.delete(`${this.path}/:id/photo`, AuthMiddleware, this.user.deleteUserPhoto);
  }
}
