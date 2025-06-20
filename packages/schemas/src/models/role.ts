import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: z.array(z.number().int()),
  scope: z.enum(["GLOBAL", "TENANT"]),
  workspaceId: z.string().uuid().nullable(),
  creatorId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type RoleSchema = z.infer<typeof roleSchema>;