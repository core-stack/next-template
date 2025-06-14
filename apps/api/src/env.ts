import { z } from 'zod';

import { getEnv } from '@packages/env';

const envSchema = z.object({
  DISABLED_WORKSPACES_DELETE_AFTER: z.number(),
  
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_DURATION: z.number().default(60 * 5), // 5 min
  JWT_REFRESH_TOKEN_DURATION: z.number().default(60 * 60 * 24 * 30), // 30 days

  ACTIVE_ACCOUNT_TOKEN_EXPIRES: z.number(),
  
  REDIS_URL: z.string().url(),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ENDPOINT: z.string(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string(),
  AWS_BUCKET: z.string(),

  API_PORT: z.number(),
  FRONTEND_URL: z.string().url(),

  SMTP_ENABLED: z.boolean(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.number(),
  SMTP_SECURE: z.boolean(),
  SMTP_USER: z.string(),
  SMTP_ENV: z.enum(["development", "production", "test"]),
  SMTP_TEST_EMAIL: z.string().optional(),
  SMTP_FROM: z.string(),
  SMTP_PASSWORD: z.string(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
});

export const env = getEnv(envSchema, process.env);
export type Env = typeof env;
