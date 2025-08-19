import { z } from 'zod';

import { groupSchema } from './models/group';
import { tenantSlugParamsSchema } from './tenant.schema';

export const createGroupSchema = groupSchema.omit({ id: true, createdAt: true, updatedAt: true, createdById: true, tenantId: true });
export type CreateGroupSchema = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = groupSchema.omit({ id: true, createdAt: true, updatedAt: true, createdById: true, tenantId: true });
export type UpdateGroupSchema = z.infer<typeof updateGroupSchema>;

export const getGroupQueryParamsSchema = z.object({
  parentId: z.string().uuid().optional(),
});
export type GetGroupQueryParamsSchema = z.infer<typeof getGroupQueryParamsSchema>;

export const updateOrDeleteGroupParamsSchema = tenantSlugParamsSchema.extend({
  id: z.string().uuid(),
});
export type UpdateOrDeleteGroupParamsSchema = z.infer<typeof updateOrDeleteGroupParamsSchema>;


export const getGroupsSchema = groupSchema.array();
export type GetGroupsSchema = z.infer<typeof getGroupsSchema>;