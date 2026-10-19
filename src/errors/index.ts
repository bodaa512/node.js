import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error', errors?: any[]) {
    super(message, 400, true, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication Error') {
    super(message, 401, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization Error') {
    super(message, 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404, true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource Conflict') {
    super(message, 409, true);
  }
}

export class PaymentError extends AppError {
  constructor(message: string = 'Payment Required') {
    super(message, 402, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429, true);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database Error', errors?: any[]) {
    super(message, 500, false, errors);
  }
}

export class UploadError extends AppError {
  constructor(message: string = 'File Upload Error') {
    super(message, 422, true);
  }
}

export class AIError extends AppError {
  constructor(message: string = 'AI Service Error') {
    super(message, 503, true);
  }
}

export { AppError };
