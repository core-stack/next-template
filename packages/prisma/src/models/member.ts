import { z } from "zod/v4";

import { WorkspaceRole } from "@prisma/client";

import { preWorkspaceSchema } from "./workspace";

export const preMemberSchema = z.object({
  id: z.uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().url().nullable(),
  fcmToken: z.string().nullable(),
  userId: z.uuid(),
  workspaceId: z.uuid(),
  role: z.nativeEnum(WorkspaceRole),
  owner: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type PreMemberSchema = z.infer<typeof preMemberSchema>;

export const memberSchema = preMemberSchema.extend({
  workspace: preWorkspaceSchema,

})
export type MemberSchema = z.infer<typeof memberSchema>;