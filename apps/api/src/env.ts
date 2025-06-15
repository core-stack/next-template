import dotenv from 'dotenv';
import { z } from 'zod';

import { getEnv } from '@packages/env';

dotenv.config();
const envBool = z.union([z.literal("true"), z.literal("false")]).transform(v => v === "true");
const envSchema = z.object({
  DISABLED_WORKSPACES_DELETE_AFTER: z.coerce.number().default(90 * 24 * 60 * 60 * 1000), // 90 days
  
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_DURATION: z.coerce.number().default(60 * 5 * 1000), // 5 min
  JWT_REFRESH_TOKEN_DURATION: z.coerce.number().default(60 * 60 * 24 * 30 * 1000), // 30 days

  ACTIVE_ACCOUNT_TOKEN_EXPIRES: z.coerce.number().default(60 * 60 * 1000), // 1h
  ALLOW_CREATE_ACCOUNT: envBool,
  
  REDIS_URL: z.string().url(),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ENDPOINT: z.string(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string(),
  AWS_BUCKET: z.string(),

  API_PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  SMTP_ENABLED: envBool.default("false"),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: envBool.default("false"),
  SMTP_USER: z.string(),
  SMTP_ENV: z.enum(["development", "production", "test"]).default("development"),
  SMTP_TEST_EMAIL: z.string().optional(),
  SMTP_FROM: z.string(),
  SMTP_PASSWORD: z.string(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
});

export const env = getEnv(envSchema, process.env);
export type Env = typeof env;
