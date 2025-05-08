import { WorkspaceRole } from "@packages/prisma";
import { z } from "zod";

import { workspaceSchema } from "./workspace";

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


export const inviteMemberSchema = z.object({
  emails: z.object({
    email: z.string().email({ message: "Email inválido" }),
    role: z.nativeEnum(WorkspaceRole, {
      required_error: "Selecione uma função",
    }),
  }).array(),
  slug: z.string(),
});

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const inviteWithWorkspaceSchema = inviteSchema.extend({
  workspace: workspaceSchema,
});
export type InviteWithWorkspaceSchema = z.infer<typeof inviteWithWorkspaceSchema>;
