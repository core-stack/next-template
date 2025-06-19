import { z } from 'zod';

import { passwordSchema } from './password.schema';

export const createAccountSchema = z.object({
  name: z.string({ message: /*i18n*/("The name is required") }).min(2, /*i18n*/("The name must be at least 2 characters")),
  email: z.string({ message: /*i18n*/("The email is required") }).email(/*i18n*/("The email is invalid")),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: /*i18n*/("Passwords do not match"),
  path: ["confirmPassword"],
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const loginSchema = z.object({
  email: z.string({ message: /*i18n*/("The email is required") }).email(/*i18n*/("The email is invalid")),
  password: passwordSchema,
  redirect: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const activeAccountSchema = z.object({
  token: z.string().uuid(/*i18n*/("Token is invalid")),
});
export type ActiveAccountSchema = z.infer<typeof activeAccountSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string({ message: /*i18n*/("The email is required") }).email(/*i18n*/("The email is invalid")),
})
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().uuid(/*i18n*/("Token is invalid")),
  password: passwordSchema,
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;