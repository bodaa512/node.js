import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors';
import { UserRole } from '../types/enums';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError('Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError('You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
