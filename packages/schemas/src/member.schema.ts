import { z } from 'zod';

export const getInWorkspaceSchema = z.object({
  slug: z.string().trim().min(1, /*i18n*/("Slug cannot be empty")),
})