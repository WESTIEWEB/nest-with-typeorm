import { config } from 'dotenv';
config();

export class AuthPayload {
  email: string;
  sub: string;
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
