import { registerAs } from '@nestjs/config';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  JWT_RESET_PASSWORD_KEY,
} from 'environments';

export default registerAs('auth', () => ({
  jwtSecret: ACCESS_TOKEN_SECRET,
  accessTokenExpiration: ACCESS_TOKEN_EXPIRES_IN,
  resetPasswordKey: JWT_RESET_PASSWORD_KEY,
}));
