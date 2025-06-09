import z from 'zod';

export const errorSchema = z.object({
  message: z.string(),
  status: z.number(),
});
export type ErrorSchema = z.infer<typeof errorSchema>;