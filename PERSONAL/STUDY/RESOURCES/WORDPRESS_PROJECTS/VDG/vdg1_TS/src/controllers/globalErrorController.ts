/** @format */

import { Request, Response, NextFunction } from 'express'
import helper from '../utils/helpers'

/**
 * The interface/type for the Error params: Could be moved into the types
 * file instead
 */
interface ErrorExt {
  statusCode: string | number
  status: string
  isOperational: boolean
  code?: number
}

/**
 * This function makes sure to send error data to that is/are relevant
 * during development so as to quickly debug the app
 * @param Object  | Request
 * @param Object | Request
 */
const sendErrorDevelopmentMode = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  })
}

/**
 * Distinguishing between operational and non operational error and
 * deciding on which error message to send to the user in such case
 * @param Error | Object
 * @param Response | Object
 */
const sendErrorProductionMode = (error: any, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    })
  } else {
    console.error('ERROR: ', error)
    helper.logError('prod-error!!!', (error as any).message)

    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

/**
 * MAIN GLOBAL ERROR MIDDLEWARE HANDLER
 * @param Object | Error
 * @param Object | Request
 * @param Object | Response
 * @param Object | NextFunction
 */
export default (
  err: Error & ErrorExt,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopmentMode(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    sendErrorProductionMode(error, res)
  }
}
