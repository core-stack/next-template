import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  roleId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
