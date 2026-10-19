import { successResponse, errorResponse, paginatedResponse } from '../../../src/utils/apiResponse';

describe('API Response Utilities (src/utils/apiResponse)', () => {
  let mockRes: any;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('successResponse should format a standard success envelope', () => {
    const data = { id: 1, name: 'Home 1' };
    successResponse(mockRes, data, 'Fetched successfully', 200);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Fetched successfully',
      data,
    });
  });

  it('errorResponse should format standard error response with status code', () => {
    errorResponse(mockRes, 'Item not found', 404, ['Resource ID is invalid']);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Item not found',
      errors: ['Resource ID is invalid'],
    });
  });

  it('paginatedResponse should include items and pagination metadata', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const pagination = { total: 10, page: 1, limit: 2, totalPages: 5 };

    paginatedResponse(mockRes, items, pagination, 'Items loaded');

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Items loaded',
      data: {
        items,
        meta: pagination,
      },
    });
  });
});
