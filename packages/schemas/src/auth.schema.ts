import { z } from 'zod';

import { passwordSchema } from './password.schema';

export const createAccountSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordSchema,
});
export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  redirect: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const activeAccountSchema = z.object({
  token: z.string().uuid(),
});
export type ActiveAccountSchema = z.infer<typeof activeAccountSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
})
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  password: passwordSchema,
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;