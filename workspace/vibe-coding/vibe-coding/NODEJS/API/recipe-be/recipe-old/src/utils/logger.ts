import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '../config';
import { Request, Response, NextFunction } from 'express';

// Create a logger instance
const logDir: string = join(__dirname, LOG_DIR || '../logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message, requestId }) => {
    return `${timestamp} [Request ID: ${
      requestId || 'N/A'
    }] ${level}: ${message}`;
  }
);
const logFormatJson = winston.format.json();

/**
 * Log level
 * - error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    // Debug log Setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD HH:mm:ss',
      dirname: logDir + '/debug', // log file /log/debug/*.log in save
      filename: '%DATE%.log',
      maxFiles: 30, // keep 30 days log
      json: false,
      zippedArchive: true,
    }),

    // Error log Setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD HH:mm:ss', // log file /log/error/*.log in save
      dirname: logDir + '/error',
      filename: '%DATE%.log',
      maxFiles: 30, // keep 30 days log
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize()
    ),
  })
);

// Generate a short requestId (5 characters)
const generateShortId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// Set a default requestId for scripts or non-request contexts
logger.defaultMeta = { requestId: generateShortId() };

// Middleware to add request ID to logs
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Safe way to access and set requestId without TypeScript errors
  const reqAny = req as any;
  reqAny.requestId = generateShortId();
  logger.defaultMeta = { requestId: reqAny.requestId };
  next();
};

// Create a custom stream object for logging
const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream, logFormatJson };
