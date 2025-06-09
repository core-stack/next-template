import { z } from 'zod';

export const tenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().nullable(),
  backgroundImage: z.string(),
  disabledAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type TenantSchema = z.infer<typeof tenantSchema>;

export const workspaceWithMemberCountSchema = tenantSchema.extend({
  memberCount: z.number()
});
export type WorkspaceWithMemberCountSchema = z.infer<typeof workspaceWithMemberCountSchema>;


export const createWorkspaceSchema = tenantSchema
  .omit({
    id: true,
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = tenantSchema
  .omit({
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  })

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const disableWorkspaceSchema = z.object({
  slug: z.string().trim().min(1),
  password: z.string().trim(),
  confirmText: z.string().trim().min(1)
});

export type DisableWorkspaceSchema = z.infer<typeof disableWorkspaceSchema>