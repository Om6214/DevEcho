import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    username?: string;
    email?: string;
    is_verified: boolean;
    otp_code?: string;
    otp_expiration?: string;
  };
}
