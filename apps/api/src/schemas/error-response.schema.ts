import z from 'zod';

export const errorResponseSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
  errors: z.array(z.object({
    path: z.string(),
    message: z.string(),
  })).optional(),
});

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;