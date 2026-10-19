import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../errors';
import { verifyAccessToken } from '../utils/token';
import { ITokenPayload } from '../types/interfaces';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Authentication token missing');
    }

    const payload = verifyAccessToken(token) as ITokenPayload;
    req.user = payload;

    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};
