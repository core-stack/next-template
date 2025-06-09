import { z } from 'zod';

import { preUserSchema } from './user';
import { preTenantSchema } from './workspace';

export const preInviteSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type PreInviteSchema = z.infer<typeof preInviteSchema>;

export const inviteSchema = preInviteSchema.extend({
  workspace: preTenantSchema,
  user: preUserSchema.nullable(),
})
export type InviteSchema = z.infer<typeof inviteSchema>;