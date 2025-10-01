import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config';
import pg from '../database';
import { HttpException } from '../exceptions/httpException';
import {
  DataStoredInToken,
  RequestWithUser,
} from '../interfaces/auth.interface';

const getAuthorization = (req: Request) => {
  const cookie = req.cookies['Authorization'] || req.cookies['authorization'];
  // log the data of the request
  // logger.info(
  //   `Request method: ${req.method}, Request URL: ${req.url}, Request body: ${JSON.stringify(
  //     req.body
  //   )}, Request headers: ${JSON.stringify(req.headers)}`
  // );

  if (cookie) {
    return cookie;
  }

  const header = req.headers['authorization'];
  if (header) {
    return header.split('Bearer ')[1];
  }

  return null;
};

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const decodedToken = verify(
        Authorization,
        SECRET_TOKEN || 'secrete'
      ) as unknown as DataStoredInToken;
      const { id } = decodedToken;

      const { rows, rowCount } = await pg.query(
        `SELECT "email", "password" FROM users WHERE id = $1`,
        [id]
      );

      if (rowCount) {
        (req as RequestWithUser).user = rows[0];
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authorization token missing'));
    }
  } catch (error) {
    if (error instanceof Error) {
      next(new HttpException(401, error.message));
    } else {
      next(
        new HttpException(
          401,
          `Wrong authentication token: ${(error as Error).message}`
        )
      );
    }
  }
};
