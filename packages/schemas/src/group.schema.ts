import { z } from 'zod';

import { groupSchema, GroupSchema } from './models/group';

export const createGroupSchema = groupSchema.omit({ id: true, createdAt: true, updatedAt: true, createdById: true, tenantId: true, parentId: true });
export type CreateGroupSchema = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = groupSchema.omit({ createdAt: true, updatedAt: true, createdById: true, tenantId: true, parentId: true, path: true });
export type UpdateGroupSchema = z.infer<typeof updateGroupSchema>;

export const getGroupQueryParamsSchema = z.object({
  path: z.string().optional(),
});
export type GetGroupQueryParamsSchema = z.infer<typeof getGroupQueryParamsSchema>;

export { groupSchema };
export type { GroupSchema };
export const getGroupsSchema = groupSchema.array();
export type GetGroupsSchema = z.infer<typeof getGroupsSchema>;