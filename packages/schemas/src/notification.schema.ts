import { z } from 'zod';

export const syncSchema = z.object({
  token: z.string({ message: /*i18n*/("Token is required") })
    .trim()
    .min(1, /*i18n*/("Token cannot be empty")),
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export const markAsReadSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export const markAllAsReadSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export const deleteSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});