import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { NODE_ENV } from '@config';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto, 'body'), this.auth.signUp);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginDto, 'body'), this.auth.logIn);
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.auth.logOut);
    this.router.post(`${this.path}/request-password-reset`, ValidationMiddleware(RequestPasswordResetDto, 'body'), this.auth.requestPasswordReset);
    this.router.post(`${this.path}/reset-password`, ValidationMiddleware(ResetPasswordDto, 'body'), this.auth.resetPassword);

    // DEV-ONLY: Add development endpoint to retrieve tokens for testing
    if (NODE_ENV === 'development') {
      this.router.get(`${this.path}/dev/get-reset-token`, this.auth.getResetTokenForDev);
    }
  }
}
