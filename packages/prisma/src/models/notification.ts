import { z } from "zod/v4";

import { preMemberSchema } from "./member";
import { preWorkspaceSchema } from "./workspace";

export const preNotificationSchema = z.object({
  id: z.uuid(),

  title: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  read: z.boolean(),

  workspaceId: z.string(),

  createdById: z.string().nullable(),

  destinationId: z.string(),

  createdAt: z.date(),
  readAt: z.date().nullable(),
});
export type PreNotificationSchema = z.infer<typeof preNotificationSchema>;

export const notificationSchema = preNotificationSchema.extend({
  workspace: preWorkspaceSchema,
  createdBy: preMemberSchema,
  destination: preMemberSchema
});

export type NotificationSchema = z.infer<typeof notificationSchema>;