import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().url().nullable(),
  fcmToken: z.string().nullable(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  owner: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type MemberSchema = z.infer<typeof memberSchema>;
