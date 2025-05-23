import { passwordSchema } from "@/validation/password";
import { z } from "zod/v4";

export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const updateProfileSchema = z.object({
  name: z.string().min(2),
});

export const getUpdateImagePresignedUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export const confirmUploadSchema = z.object({
  key: z.string().min(1),
})