import { z } from 'zod';

import { accountSchema } from './account';

export const preUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  roleId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export type PreUserSchema = z.infer<typeof preUserSchema>;

export const userSchema = preUserSchema.extend({
  accounts: z.array(accountSchema)
});

export type UserSchema = z.infer<typeof userSchema>;
