import { z } from 'zod';

import { publicEnv } from './env.public';

const envSchema = z.object({
  REDIS_URL: z.string().url(),

  SMTP_HOST: z.string().url(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_SECURE: z.coerce.boolean().default(false),
})

export const env = { 
  ...envSchema.parse(process.env),
  ...publicEnv
};