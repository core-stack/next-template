import z from 'zod';

export const docMetadataSchema = z.object({
  modifiedAt: z.date().optional(),
  modifiedBy: z.string().optional(),
  groups: z.string().array().optional(),
  index: z.number().int().positive().optional(),
  entities: z.string().array().optional(),
  type: z.enum(['markdown', 'code', 'text', 'list', 'video', 'audio', 'link']),
  sourceId: z.string()
}).catchall(z.any());
export type DocMetadata = z.infer<typeof docMetadataSchema>;

export const docSchema = z.object({
  _key: z.string(),
  text: z.string(),
  tenantId: z.string(),
  embeddings: z.array(z.number()),
  metadata: docMetadataSchema
});

export type Doc = z.infer<typeof docSchema>;