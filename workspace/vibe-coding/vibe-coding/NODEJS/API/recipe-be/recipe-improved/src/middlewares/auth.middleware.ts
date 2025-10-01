import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { query } from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const decoded = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      console.log('JWT Decoded Token:', decoded);

      // Strict validation of the user ID from token
      if (!decoded || !decoded.id) {
        return next(new HttpException(401, 'Invalid authentication token: missing user ID'));
      }

      // Use the UUID directly - no conversion needed as we now store UUIDs in the token
      const userId = decoded.id;

      console.log('Valid user ID from token:', userId);

      const { rows, rowCount } = await query(
        `
        SELECT
          "id",
          "email",
          "password"
        FROM
          users
        WHERE
          "id" = $1
      `,
        [userId], // Use the UUID directly
      );

      if (rowCount) {
        req.user = rows[0] as User;
        console.log('User attached to request:', req.user);
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
