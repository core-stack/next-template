import { passwordSchema } from "@/validation/password";
import { z } from "zod";

export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2),
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const getUpdateImagePresignedUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().max(5 * 1024 * 1024), // 5MB
});

export const confirmUploadSchema = z.object({
  key: z.string().min(1),
})