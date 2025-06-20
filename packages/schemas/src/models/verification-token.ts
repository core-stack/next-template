import { z } from 'zod';

export const verificationTokenSchema = z.object({
  type: z.enum(["ACTIVE_ACCOUNT", "RESET_PASSWORD"]),
  token: z.string().uuid(),
  expires: z.date(),
  userId: z.string().uuid(),
});
export type VerificationTokenSchema = z.infer<typeof verificationTokenSchema>;