import { z } from 'zod';

export const inviteSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type InviteSchema = z.infer<typeof inviteSchema>;
