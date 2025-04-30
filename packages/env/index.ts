import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  REDIS_URL: z.string().url(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_SECURE: z.coerce.boolean().default(false),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_DURATION: z.coerce.number().default(60 * 5), // 5 minutes
  JWT_REFRESH_TOKEN_DURATION: z.coerce.number().default(60 * 60 * 24 * 7), // 7 days
})

export const env = envSchema.parse(process.env);