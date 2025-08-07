import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  roleId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export type UserSchema = z.infer<typeof userSchema>;
