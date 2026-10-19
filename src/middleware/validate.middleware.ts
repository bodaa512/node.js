import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors';

/**
 * Generic Zod validation middleware factory
 * @param schema Zod schema to validate against
 * @param source Request property to validate ('body' | 'params' | 'query')
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'params' | 'query' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ValidationError(`Validation failed: ${errors}`));
      } else {
        next(error);
      }
    }
  };
};
