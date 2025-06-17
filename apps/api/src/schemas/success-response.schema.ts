import z from 'zod';

export const successResponseSchema = z.object({
  message: z.string(),
  status: z.number().optional()
});

export type SuccessResponseSchema = z.infer<typeof successResponseSchema>;