import { z } from 'zod';

import { publicEnv } from './env.public';

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  AUTH_SECRET: z.string(),
})
export const env = { 
  ...envSchema.parse(process.env),
  ...publicEnv
};