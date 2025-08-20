import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string().uuid(),

  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  read: z.boolean(),

  tenantId: z.string(),

  createdById: z.string().optional(),

  destinationId: z.string(),

  createdAt: z.date(),
  readAt: z.date().optional(),
});
export type PreNotificationSchema = z.infer<typeof notificationSchema>;