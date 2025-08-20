import z from 'zod';

export const groupSchema = z.object({
  id: z.string().uuid(),
  
  name: z.string().min(1),
  slug: z.string().trim().min(1, /*i18n*/("Slug cannot be empty")),
  description: z.string().optional(),
  path: z.string().optional(),

  parentId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
  createdById: z.string().uuid().optional(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type GroupSchema = z.infer<typeof groupSchema>;