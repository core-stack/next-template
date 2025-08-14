import z from 'zod';

export const sourceSchema = z.object({
  _key: z.string(),
  originalName: z.string(),
  type: z.enum(['file', 'link', 'text', 'audio', 'video']),
  url: z.string().url().optional(), // for links
  filePath: z.string().optional(), // for files
  tenantId: z.string(),
  metadata: z.object({
    modifiedAt: z.date().optional(),
    modifiedBy: z.string().optional(),
    groups: z.string().array().optional(),
  }).catchall(z.any())
});

export type Source = z.infer<typeof sourceSchema>;