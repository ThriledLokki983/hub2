import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { logger } from '../utils/logger';

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const details = error.details; // Get the details object if present

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );

    // Return a structured error response, including any details if they exist
    if (details) {
      res.status(status).json({ message, ...details });
    } else {
      res.status(status).json({ message });
    }
  } catch (error) {
    next(error);
  }
};
