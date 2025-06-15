import z from 'zod';

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;