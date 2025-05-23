import { z } from "zod/v4";

import { VerificationType } from "@prisma/client";

import { preUserSchema } from "./user";

export const preVerificationTokenSchema = z.object({
  type: z.nativeEnum(VerificationType),
  token: z.uuid(),
  expires: z.date(),
  userId: z.uuid(),
});
export type PreVerificationTokenSchema = z.infer<typeof preVerificationTokenSchema>;

export const verificationTokenSchema = preVerificationTokenSchema.extend({
  user: preUserSchema
});

export type VerificationTokenSchema = z.infer<typeof verificationTokenSchema>;