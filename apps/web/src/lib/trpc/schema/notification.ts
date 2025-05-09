import { z } from 'zod';

import { memberSchema } from './member';

export const notificationSchema = z.object({
  id: z.string(),

  title: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  read: z.boolean(),

  workspaceId: z.string(),

  createdById: z.string().nullable(),
  createdBy: memberSchema.nullable(),

  destinationId: z.string(),
  destination: memberSchema,

  createdAt: z.date(),
  readAt: z.date().nullable(),
});
export type NotificationSchema = z.infer<typeof notificationSchema>;
