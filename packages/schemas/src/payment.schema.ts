import { z } from 'zod';

export const checkoutSchema = z.object({
  priceId: z.string({ message: /*i18n*/("Price ID is required") })
    .min(1, /*i18n*/("Price ID cannot be empty")),
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

export const customerPortalSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export type CustomerPortalSchema = z.infer<typeof customerPortalSchema>;