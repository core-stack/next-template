import { z } from "zod/v4";

import { WorkspaceRole } from "@prisma/client";

import { preUserSchema } from "./user";
import { preWorkspaceSchema } from "./workspace";

export const preInviteSchema = z.object({
  id: z.uuid(),
  workspaceId: z.uuid(),
  email: z.string().email(),
  role: z.nativeEnum(WorkspaceRole),
  userId: z.uuid().nullable(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type PreInviteSchema = z.infer<typeof preInviteSchema>;

export const inviteSchema = preInviteSchema.extend({
  workspace: preWorkspaceSchema,
  user: preUserSchema.nullable(),
})
export type InviteSchema = z.infer<typeof inviteSchema>;