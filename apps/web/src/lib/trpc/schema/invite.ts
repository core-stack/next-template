import { z } from 'zod';

import { WorkspaceRole } from '@packages/prisma';

export const inviteSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  role: z.nativeEnum(WorkspaceRole),
  userId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
});
export type InviteSchema = z.infer<typeof inviteSchema>;