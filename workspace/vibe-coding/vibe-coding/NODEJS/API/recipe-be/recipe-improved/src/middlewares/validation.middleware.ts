import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param value 'body' | 'query' | 'params' - Which part of the request to validate
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req[value]);
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        // Don't try to modify read-only properties
        if (value === 'query') {
          // For query parameters, we can't modify req.query directly
          // Instead, we can attach the validated query to a custom property
          (req as any).validatedQuery = dto;
        } else if (value === 'params') {
          // Similar for params, which might be read-only
          (req as any).validatedParams = dto;
        } else {
          // Body is typically writable
          req[value] = dto;
        }
        next();
      })
      .catch(errors => {
        // Ensure errors is an array
        const errorArray = Array.isArray(errors) ? errors : [errors];

        // More robust error message extraction
        let message = 'Validation failed';
        try {
          // Try to extract constraint messages from ValidationError objects
          const messages = errorArray
            .map((error: ValidationError) => {
              if (error.constraints) {
                return Object.values(error.constraints).join(', ');
              }
              if (error.children && error.children.length) {
                return error.children
                  .map(child => Object.values(child.constraints || {}).join(', '))
                  .filter(msg => msg)
                  .join(', ');
              }
              return error.toString();
            })
            .filter(msg => msg);

          if (messages.length) {
            message = messages.join(', ');
          }
        } catch (e) {
          // Fallback if error structure is unexpected
          message = 'Validation error occurred';
          console.error('Error parsing validation errors:', e);
        }

        next(new HttpException(400, message));
      });
  };
};
