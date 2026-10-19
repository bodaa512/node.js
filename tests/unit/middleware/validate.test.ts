import { z } from 'zod';
import { validate } from '../../../src/middleware/validate.middleware';
import { ValidationError } from '../../../src/errors';

describe('Validate Middleware (src/middleware/validate.middleware)', () => {
  const schema = z.object({
    name: z.string().min(3),
    age: z.number().positive(),
  });

  it('should call next with no error when body conforms to schema', async () => {
    const middleware = validate(schema, 'body');
    const req: any = { body: { name: 'Villa', age: 5 } };
    const res: any = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with ValidationError when body is invalid', async () => {
    const middleware = validate(schema, 'body');
    const req: any = { body: { name: 'Hi', age: -1 } };
    const res: any = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ValidationError);
    expect(errorArg.message).toContain('Validation failed');
  });
});
