"server-only";
import 'dotenv/config';

import z from 'zod';

import { getEnv } from '@packages/env';

import { publicEnv } from './env.public';

export const envSchema = getEnv(z.object({
  API_URL: z.string().url().default("http://localhost:4000"),
}), process.env);
export const env = { ...envSchema, ...publicEnv };