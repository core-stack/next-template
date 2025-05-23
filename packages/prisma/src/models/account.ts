import { z } from "zod/v4";

import { preUserSchema } from "./user";

export const preAccountSchema = z.object({
  id: z.uuid(),
  provider: z.string(),
  providerAccountId: z.string(),
  userId: z.uuid(),
});
export type PreAccountSchema = z.infer<typeof accountSchema>;

export const accountSchema = preAccountSchema.extend({
  user: preUserSchema
});
export type AccountSchema = z.infer<typeof accountSchema>;