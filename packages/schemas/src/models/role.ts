import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: z.number().int(),
  scope: z.enum(["GLOBAL", "TENANT"]),
  tenantId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export type RoleSchema = z.infer<typeof roleSchema>;