import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string().uuid(),

  title: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  read: z.boolean(),

  tenantId: z.string(),

  createdById: z.string().nullable(),

  destinationId: z.string(),

  createdAt: z.date(),
  readAt: z.date().nullable(),
});
export type PreNotificationSchema = z.infer<typeof notificationSchema>;