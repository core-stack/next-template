import { z } from 'zod';

import { preInviteSchema } from './invite';
import { preMemberSchema } from './member';
import { preNotificationSchema } from './notification';
import { preSubscriptionSchema } from './subscription';

export const preTenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().nullable(),
  backgroundImage: z.string(),
  disabledAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type PreTenantSchema = z.infer<typeof preTenantSchema>;

export const tenantSchema = preTenantSchema.extend({
  members: z.array(preMemberSchema),
  subscription: preSubscriptionSchema.nullable(),
  invites: z.array(preInviteSchema),
  notifications: z.array(preNotificationSchema),
});
export type TenantSchema = z.infer<typeof tenantSchema>;