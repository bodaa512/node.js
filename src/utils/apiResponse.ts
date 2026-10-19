import { Response } from 'express';
import { IApiResponse, IPaginatedResponse } from '../types/interfaces';

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response<IApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: any[]
): Response<IApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: { total: number; page: number; limit: number; totalPages: number },
  message: string = 'Success'
): Response<IPaginatedResponse<T>> => {
  return res.status(200).json({
    success: true,
    message,
    data: {
      items: data,
      meta: pagination,
    },
  });
};
