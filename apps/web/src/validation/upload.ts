import { z } from "zod";

export const uploadImageSchema = z.object({
  name: z.string(),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  size: z.number().max(5 * 1024 * 1024), // 5MB
});

export type UploadImageSchema = z.infer<typeof uploadImageSchema>;