import { VerificationType } from "@packages/prisma";
import { z } from "zod";

import { preUserSchema } from "./user";

export const preVerificationTokenSchema = z.object({
  type: z.nativeEnum(VerificationType),
  token: z.string().uuid(),
  expires: z.date(),
  userId: z.string().uuid(),
});
export type PreVerificationTokenSchema = z.infer<typeof preVerificationTokenSchema>;

export const verificationTokenSchema = preVerificationTokenSchema.extend({
  user: preUserSchema
});

export type VerificationTokenSchema = z.infer<typeof verificationTokenSchema>;