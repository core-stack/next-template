import { z } from "zod";

import { preUserSchema } from "./user";

export const preAccountSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  providerAccountId: z.string(),
  userId: z.string().uuid(),
});
export type PreAccountSchema = z.infer<typeof accountSchema>;

export const accountSchema = preAccountSchema.extend({
  user: preUserSchema
});
export type AccountSchema = z.infer<typeof accountSchema>;