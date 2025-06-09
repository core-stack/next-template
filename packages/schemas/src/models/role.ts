import { z } from 'zod';

import { RoleScope } from '@prisma/client';

import { preMemberSchema } from './member';
import { preTenantSchema } from './workspace';

export const preRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: z.array(z.number().int()),
  scope: z.nativeEnum(RoleScope),
  workspaceId: z.string().uuid().nullable(),
  creatorId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type PreRoleSchema = z.infer<typeof preRoleSchema>;

export const roleSchema = preRoleSchema.extend({
  creator: preMemberSchema.nullable(),
  workspace: preTenantSchema.nullable(),
  users: z.array(preMemberSchema),
});

export type RoleSchema = z.infer<typeof roleSchema>;