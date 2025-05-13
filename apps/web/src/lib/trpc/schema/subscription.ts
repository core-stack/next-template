import { z } from "zod";

import { SubscriptionStatus } from "@packages/prisma";

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  plan: z.string(),
  workspaceId: z.string().uuid(),
  stripeCustomerId: z.string().nullable(),
  stripeProductId: z.string().nullable(),
  stripePriceId: z.string().nullable(),
  stripeSubscriptionId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.nativeEnum(SubscriptionStatus),
});
export type SubscriptionSchema = z.infer<typeof subscriptionSchema>;