import { WorkspaceRole } from "@packages/prisma";
import { z } from "zod";

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