import { z } from 'zod';

import { memberSchema, roleSchema } from './models';
import { passwordSchema } from './password.schema';

export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string({ message: /*i18n*/("Name is required") })
    .min(2, /*i18n*/("Name must be at least 2 characters")),
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const getUpdateImagePresignedUrlSchema = z.object({
  fileName: z.string({ message: /*i18n*/("File name is required") })
    .min(1, /*i18n*/("File name cannot be empty")),
  contentType: z.string({ message: /*i18n*/("Content type is required") })
    .min(1, /*i18n*/("Content type cannot be empty")),
  fileSize: z.number({ message: /*i18n*/("File size is required") })
    .max(5 * 1024 * 1024, /*i18n*/("File size must be less than 5MB")),
});
export type GetUpdateImagePresignedUrlSchema = z.infer<typeof getUpdateImagePresignedUrlSchema>;

export const confirmUploadSchema = z.object({
  key: z.string({ message: /*i18n*/("Key is required") })
    .min(1, /*i18n*/("Key cannot be empty")),
});
export type ConfirmUploadSchema = z.infer<typeof confirmUploadSchema>;

export const getSelfSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") }).uuid(/*i18n*/("ID must be a valid UUID")),
  name: z.string().optional(),
  email: z.string({ message: /*i18n*/("Email is required") }).email(/*i18n*/("The email is invalid")),
  role: roleSchema,
  image: z.string().optional(),
  createdAt: z.date({ message: /*i18n*/("Creation date is required") }),
  updatedAt: z.date({ message: /*i18n*/("Update date must be a valid date") }).optional(),
  members: memberSchema.extend({
    role: roleSchema,
    tenant: z.object({
      id: z.string({ message: /*i18n*/("ID is required") }).uuid(/*i18n*/("ID must be a valid UUID")),
      slug: z.string({ message: /*i18n*/("Slug is required") })
    })
  }).array()
});