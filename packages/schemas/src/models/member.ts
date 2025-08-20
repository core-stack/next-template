import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
  fcmToken: z.string().optional(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  owner: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type MemberSchema = z.infer<typeof memberSchema>;
