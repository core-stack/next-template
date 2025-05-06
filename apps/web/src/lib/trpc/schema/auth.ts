import { passwordSchema } from "@/validation/password";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  redirect: z.string().optional(),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const createAccountSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type CreateAccountSchema = z.infer<typeof createAccountSchema>;