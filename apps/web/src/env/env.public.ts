import { z } from 'zod';

const publicEnvSchema = z.object({
  
});

export const publicEnv = publicEnvSchema.parse(process.env);