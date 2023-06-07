import { config } from 'dotenv';
config();

export class AuthPayload {
  email: string;
  sub: string;
  id?: string;
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
