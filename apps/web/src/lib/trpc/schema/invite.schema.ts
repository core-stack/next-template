import { preInviteSchema, preWorkspaceSchema, WorkspaceRole } from "@packages/prisma";
import { z } from "zod/v4";

export const inviteWithWorkspaceSchema = preInviteSchema.extend({
  workspace: preWorkspaceSchema
})


export const inviteMemberSchema = z.object({
  slug: z.string().trim().min(1),
  emails: z.array(z.object({
    email: z.string().email(),
    role: z.nativeEnum(WorkspaceRole)
  }))
})

export const deleteInviteSchema = z.object({
  id: z.uuid(),
  slug: z.string().trim()
})

export const getInviteSchema = z.object({
  id: z.uuid(),
})

export const getInviteByWorkspaceSchema = z.object({
  slug: z.string().trim()
})
