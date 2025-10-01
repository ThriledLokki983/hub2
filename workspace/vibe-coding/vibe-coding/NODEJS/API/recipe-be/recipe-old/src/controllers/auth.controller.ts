import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { HttpException } from '../exceptions/httpException';
import { LoginUserDto, SignupUserDto } from '../dto/user.dto';

export class AuthController {
  public auth = new AuthService();

  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as SignupUserDto;
      const signUpUserData = await this.auth.signup(userData);

      // Auto-login user after signup by generating token/cookie
      const { cookie, user } = await this.auth.login({
        email: userData.email,
        password: userData.password
      });

      res.setHeader('Set-Cookie', [cookie]);
      res.status(201).json({
        data: user,
        message: `Successfully signed up and logged in as ${user.email}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as LoginUserDto;
      const { cookie, user } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user, message: 'login successful' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = (req as RequestWithUser).user;

      if (!user) {
        return next(new HttpException(401, 'User not authenticated'));
      }

      const logOutUserData = await this.auth.logout(user);

      res.setHeader('Set-Cookie', ['Authorization=; Max-Age=0']);
      res.status(200).json({
        data: logOutUserData,
        message: `successfully logged user ${logOutUserData.email} out`,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.auth.getAllUsers();
      res.status(200).json({ users, length: users.length, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = (req as RequestWithUser).user;

      if (!user) {
        return next(new HttpException(401, 'User not authenticated'));
      }

      const userData = await this.auth.getCurrentUser(user.email);
      res
        .status(200)
        .json({ data: userData, message: 'profile retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Since this endpoint is protected with AuthMiddleware,
      // if execution reaches here, token is valid
      const user = (req as RequestWithUser).user;

      if (!user) {
        return next(new HttpException(401, 'User not authenticated'));
      }

      res.status(200).json({
        isAuthenticated: true,
        user: {
          email: user.email
        },
        message: 'Token is valid'
      });
    } catch (error) {
      next(error);
    }
  };

  public createRandomUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const randomUser = await this.auth.createRandomUserFromRecipe();

      res.status(201).json({
        data: randomUser,
        message: `Successfully created random user: ${randomUser.name}`,
      });
    } catch (error) {
      next(error);
    }
  };
}
