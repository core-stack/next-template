import { z } from "zod/v4";

export const compressImageSchema = z.object({
  key: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});
export type CompressImagePayload = z.infer<typeof compressImageSchema>;