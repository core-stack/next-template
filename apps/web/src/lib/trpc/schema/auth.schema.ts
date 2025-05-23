import { passwordSchema } from "@/validation/password";
import { z } from "zod/v4";

export const createAccountSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  redirect: z.string().optional(),
});