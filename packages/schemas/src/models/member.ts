import { z } from 'zod';

import { WorkspaceRole } from '@prisma/client';

import { preTenantSchema } from './workspace';

export const preMemberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().url().nullable(),
  fcmToken: z.string().nullable(),
  userId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  role: z.nativeEnum(WorkspaceRole),
  owner: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type PreMemberSchema = z.infer<typeof preMemberSchema>;

export const memberSchema = preMemberSchema.extend({
  workspace: preTenantSchema,

})
export type MemberSchema = z.infer<typeof memberSchema>;