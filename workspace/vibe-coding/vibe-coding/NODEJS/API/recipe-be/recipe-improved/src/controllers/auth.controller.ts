import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import { NODE_ENV } from '@config';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const { cookie, findUser } = await this.auth.login(loginData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passwordResetData: RequestPasswordResetDto = req.body;
      const result = await this.auth.requestPasswordReset(passwordResetData);

      res.status(200).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resetData: ResetPasswordDto = req.body;
      const result = await this.auth.resetPassword(resetData);

      res.status(200).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  };

  // Development-only method to retrieve reset tokens for testing
  public getResetTokenForDev = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only allow in development mode
    if (NODE_ENV !== 'development') {
      return res.status(404).json({ message: 'Not found' });
    }

    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
      }

      const token = await this.auth.getResetTokenForDev(email);

      if (!token) {
        return res.status(404).json({ message: 'No active reset token found for this email' });
      }

      res.status(200).json({ email, token });
    } catch (error) {
      next(error);
    }
  };
}
