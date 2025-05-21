import { SubscriptionStatus } from "@packages/prisma";
import { z } from "zod";

import { preWorkspaceSchema } from "./workspace";

export const preSubscriptionSchema = z.object({
  id: z.string().uuid(),
  plan: z.string(),
  workspaceId: z.string().uuid(),
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