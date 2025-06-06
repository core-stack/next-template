import { z } from "zod";

export const compressImageSchema = z.object({
  key: z.string(),
  width: z.number(),
  height: z.number(),
});
export type CompressImagePayload = z.infer<typeof compressImageSchema>;
