/** @format */
import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'
import HttpException from '../exceptions/HttpException'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.message)

  if (res.headersSent) {
    return next(err.message)
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? err.message : err.stack,
  })
}

export class AppError extends Error {
  status: string
  isOperational: boolean

  constructor(public message: string, public statusCode: number | string) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('errorMiddleware', error);

    const status: number = error.status || 500
    const message: string = error.message || 'Something went wrong'

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    )
    res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}

export default { errorHandler, errorMiddleware }
