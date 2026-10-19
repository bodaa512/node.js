import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import logger from '../config/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`[Error] ${err.message}`, { 
    stack: err.stack, 
    path: req.path,
    method: req.method
  });

  // Handle specific known errors
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((el: any) => el.message);
    res.status(400).json({
      success: false,
      message: 'Invalid input data',
      errors,
    });
    return;
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    // Mongoose duplicate key error
    const field = Object.keys(err.keyValue)[0];
    res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token, please login again',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token has expired, please login again',
    });
    return;
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(422).json({
      success: false,
      message: 'File is too large',
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Handle generic unknown errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
