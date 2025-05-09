import { z } from 'zod';

import { passwordSchema } from '@/validation/password';
import { UserRole, WorkspaceRole } from '@packages/prisma';

export const selfUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  image: z.string().nullable(),
  members: z.object({
    id: z.string(),
    workspaceId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.nativeEnum(WorkspaceRole),
    createdAt: z.date(),
    updatedAt: z.date(),
    workspace: z.object({
      id: z.string(),
      slug: z.string(),
    })
  }).array(),
});

export type SelfUserSchema = z.infer<typeof selfUserSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
});
export type UpdateUserNameSchema = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z.object({
  currentPassword: passwordSchema.optional(),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas devem ser iguais",
  path: ["confirmPassword"],
});
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const updateUserPictureSchema = z.object({
  fileName: z.string(),
  contentType: z.string().refine((v) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(v), {
    message: 'Formato inválido',
  }),
  fileSize: z.number().max(5 * 1024 * 1024, 'Máx 5MB'),
});
export type UpdateUserPictureSchema = z.infer<typeof updateUserPictureSchema>;

export const confirmUploadProfileImageSchema = z.object({
  key: z.string(),
})
export type ConfirmUploadProfileImageSchema = z.infer<typeof confirmUploadProfileImageSchema>;