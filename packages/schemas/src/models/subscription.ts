import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  plan: z.string(),
  tenantId: z.string().uuid(),
  stripeSubscriptionId: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  stripeProductId: z.string().nullable(),
  stripePriceId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(["active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"]),
});

export type SubscriptionSchema = z.infer<typeof subscriptionSchema>;