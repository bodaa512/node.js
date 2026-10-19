import { ITokenPayload, IHomeAccessContext } from './interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
      homeAccess?: IHomeAccessContext;
    }
  }
}
