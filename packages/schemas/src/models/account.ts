import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  providerAccountId: z.string(),
  userId: z.string().uuid(),
});
export type AccountSchema = z.infer<typeof accountSchema>;