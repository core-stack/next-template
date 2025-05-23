import { z } from "zod/v4";

import { SubscriptionStatus } from "@prisma/client";

import { preWorkspaceSchema } from "./workspace";

export const preSubscriptionSchema = z.object({
  id: z.uuid(),
  plan: z.string(),
  workspaceId: z.uuid(),
  stripeSubscriptionId: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  stripeProductId: z.string().nullable(),
  stripePriceId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.nativeEnum(SubscriptionStatus),
});
export type PreSubscriptionSchema = z.infer<typeof preSubscriptionSchema>;

export const subscriptionSchema = preSubscriptionSchema.extend({
  workspace: preWorkspaceSchema
})