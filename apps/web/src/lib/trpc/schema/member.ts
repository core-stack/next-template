import { z } from 'zod';

import { WorkspaceRole } from '@packages/prisma';

export const memberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  userId: z.string().uuid(),
  user: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    image: z.string().optional().nullable(),
    email: z.string().email().nullable(),
  }),
  workspaceId: z.string().uuid(),
  role: z.nativeEnum(WorkspaceRole),
  owner: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type MemberSchema = z.infer<typeof memberSchema>;

export const inviteMemberSchema = z.object({
  emails: z.object({
    email: z.string().email({ message: "Email inválido" }),
    role: z.nativeEnum(WorkspaceRole, {
      required_error: "Selecione uma função",
    }),
  }).array(),
  slug: z.string(),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;