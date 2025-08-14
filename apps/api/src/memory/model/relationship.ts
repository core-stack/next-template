import z from 'zod';

export const relationshipSchema = z.object({
  _from: z.string(),
  _to: z.string(),
  type: z.string(),
  strength: z.number().positive(),
  tenantId: z.string(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type Relationship = z.infer<typeof relationshipSchema>;