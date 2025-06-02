import { preWorkspaceSchema } from "@packages/prisma";
import { z } from "zod";

export const workspaceWithMemberCountSchema = preWorkspaceSchema.extend({
  memberCount: z.number()
});
export type WorkspaceWithMemberCountSchema = z.infer<typeof workspaceWithMemberCountSchema>;


export const createWorkspaceSchema = preWorkspaceSchema
  .omit({
    id: true,
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = preWorkspaceSchema
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