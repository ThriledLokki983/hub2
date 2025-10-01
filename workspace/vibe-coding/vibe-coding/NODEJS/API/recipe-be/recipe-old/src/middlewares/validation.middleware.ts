import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HttpException } from '../exceptions/httpException';

/**
 * Validation middleware that uses Zod schemas to validate request data
 * @param schema The Zod schema to validate against
 * @param type Where to find the data to validate (body, query, params)
 * @returns Express middleware function
 */
export const validateMiddleware = (
  schema: AnyZodObject,
  type: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request data against the provided schema
      const data = await schema.parseAsync(req[type]);
      // Replace the request data with the validated data
      req[type] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        // Create a more structured error with validation details as an object property
        next(
          new HttpException(400, 'Validation error', {
            validationErrors: formattedErrors,
          })
        );
      } else {
        next(new HttpException(500, 'Internal server error during validation'));
      }
    }
  };
};
