import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';
import { apiResponse } from '@utils/responseFormatter';
import { HttpStatusCodes } from '@utils/httpStatusCodes';
import { ApiError } from '@interfaces/response.interface';

// Express requires error middleware to have exactly 4 parameters
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    // Don't send response if headers already sent
    if (res.headersSent) {
      return next(error);
    }

    const status: number = error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const message: string = error.message || 'Something went wrong';

    // Log the error with request details
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    // In development, log the stack trace for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.debug(error.stack);
    }

    // Structure the error in our standard format
    const errorDetail: ApiError = {
      message,
    };

    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        apiResponse.badRequest(res, message, [errorDetail]);
        break;
      case HttpStatusCodes.UNAUTHORIZED:
        apiResponse.unauthorized(res, message);
        break;
      case HttpStatusCodes.FORBIDDEN:
        apiResponse.forbidden(res, message);
        break;
      case HttpStatusCodes.NOT_FOUND:
        apiResponse.notFound(res, message);
        break;
      case HttpStatusCodes.CONFLICT:
        apiResponse.conflict(res, message);
        break;
      default:
        apiResponse.serverError(res, message);
    }
  } catch (err) {
    // If an error occurs while handling the error, fall back to a simple response
    logger.error(`Error in ErrorMiddleware: ${err.message}`);
    res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
  }
};
