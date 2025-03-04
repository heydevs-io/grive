import { registerAs } from '@nestjs/config';

export default registerAs('difyAi', () => ({
  baseUrl: process.env.DIFY_AI_API_URL,
  email: process.env.DIFY_AI_EMAIL,
  password: process.env.DIFY_AI_PASSWORD,
}));
