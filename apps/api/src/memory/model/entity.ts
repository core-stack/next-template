import z from 'zod';

export const entitySchema = z.object({
  _key: z.string(),
  text: z.string(),
  type: z.string(),
  tenantId: z.string(),
  metadata: z.object({
    modifiedAt: z.date().optional(),
    modifiedBy: z.string().optional(),
  }).catchall(z.any())
});

export type Entity = z.infer<typeof entitySchema>;