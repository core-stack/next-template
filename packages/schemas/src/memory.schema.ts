import { z } from 'zod';

export const saveMemorySchema = z.object({
  title: z.string(),
  text: z.string(),
  type: z.enum(["markdown"]).optional().default("markdown"),
  groupId: z.string().uuid().optional(),
});
export type SaveMemorySchema = z.infer<typeof saveMemorySchema>;

export const deleteMemorySchema = z.object({
  id: z.string().uuid(),
});
export type DeleteMemorySchema = z.infer<typeof deleteMemorySchema>;