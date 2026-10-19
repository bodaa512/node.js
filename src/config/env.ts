import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/homepilot'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  CLIENT_URL: z.string().default('http://localhost:4200'),
  JWT_SECRET: z.string().default('homepilot-jwt-super-secret-key-development-mode-2026'),
  JWT_REFRESH_SECRET: z.string().default('homepilot-jwt-refresh-secret-key-development-mode-2026'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().default('demo'),
  CLOUDINARY_API_KEY: z.string().default('123456789'),
  CLOUDINARY_API_SECRET: z.string().default('secret'),
  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_PORT: z.string().default('587'),
  EMAIL_USER: z.string().default('demo@homepilot.com'),
  EMAIL_PASSWORD: z.string().default('demo-pass'),
  EMAIL_FROM: z.string().default('HomePilot <noreply@homepilot.com>'),
  AI_PROVIDER: z.string().default('openai'),
  AI_API_KEY: z.string().default('sk-demo-key'),
  AI_MODEL: z.string().default('gpt-4o-mini'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_demo'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_demo'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
