import { z } from 'zod';

export const inviteSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type InviteSchema = z.infer<typeof inviteSchema>;

export const inviteMemberSchema = z.object({
  slug: z.string().trim().min(1),
  emails: z.array(z.object({
    email: z.string().email(),
    role: z.string().uuid(),
  }))
});
export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const deleteInviteSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().trim()
})

export const getInviteSchema = z.object({
  id: z.string().uuid(),
})

export const getInviteByWorkspaceSchema = z.object({
  slug: z.string().trim()
})
