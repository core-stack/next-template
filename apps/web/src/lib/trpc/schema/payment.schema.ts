import { z } from "zod/v4";

export const checkoutSchema = z.object({
  priceId: z.string().min(1),
  slug: z.string().min(1)
});

export const customerPortalSchema = z.object({
  slug: z.string().min(1)
})