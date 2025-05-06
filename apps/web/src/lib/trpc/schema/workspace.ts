import { z } from 'zod';

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().nullable(),
  backgroundType: z.enum(["color", "gradient"]),
  backgroundColor: z.string().nullable(),
  backgroundGradient: z.string().nullable(),
  disabledAt: z.date().nullable(),
});
export type WorkspaceSchema = z.infer<typeof workspaceSchema>;

export const workspaceListSchema = z.array(workspaceSchema);
export type WorkspaceListSchema = z.infer<typeof workspaceListSchema>;

export const createWorkspaceSchema = workspaceSchema.omit({ id: true, disabledAt: true });
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = workspaceSchema.omit({ disabledAt: true });
export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const workspaceWithCountSchema = workspaceSchema.extend({
  memberCount: z.number(),
});
export type WorkspaceWithCountSchema = z.infer<typeof workspaceWithCountSchema>;

export const disableWorkspaceSchema = z.object({
  slug: z.string(),
  password: z.string(),
  confirmText: z.string(),
})
export type DisableWorkspaceSchema = z.infer<typeof disableWorkspaceSchema>;

export const enableWorkspaceSchema = disableWorkspaceSchema.omit({ confirmText: true });
export type EnableWorkspaceSchema = z.infer<typeof enableWorkspaceSchema>;