import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string; // Changed from number to string for UUID
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
