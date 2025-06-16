import { z } from 'zod';

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