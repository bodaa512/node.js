import { IPagination } from '../types/interfaces';

export const parsePagination = (query: any) => {
  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = (query.sort as string) || 'createdAt';
  const order = (query.order as string) === 'asc' ? 1 : -1;

  return { page, limit, skip, sort, order };
};

export const createPaginationMeta = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
