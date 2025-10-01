import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ count: findAllUsersData.length, message: 'Fetched all users successfully', data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id; // Now directly using string UUID
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id; // Now directly using string UUID
      const userData: UpdateUserDto = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id; // Now directly using string UUID
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new HttpException(401, 'User not authenticated');
      }

      const userId = req.user.id; // Now string UUID
      // We don't need to validate the ID again as it's already validated in the auth middleware

      const findUserData: User = await this.user.findUserById(userId);
      res.status(200).json({ data: findUserData, message: 'current' });
    } catch (error) {
      console.error('getCurrentUser error:', error);
      next(error);
    }
  };
}
