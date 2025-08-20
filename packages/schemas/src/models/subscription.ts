import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  plan: z.string(),
  tenantId: z.string().uuid(),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(["active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"]),
});

export type SubscriptionSchema = z.infer<typeof subscriptionSchema>;