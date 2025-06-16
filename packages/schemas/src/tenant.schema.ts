import { z } from 'zod';

export const tenantSlugSchema = z
  .string({ message: /*i18n*/("Slug is required") })
  .min(2, /*i18n*/("Slug must be at least 2 characters"))
  .regex(/^[a-z0-9-]+$/, /*i18n*/("Slug can only contain lowercase letters, numbers and hyphens"));

export type TenantSlugSchema = z.infer<typeof tenantSlugSchema>;

export const tenantSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
  name: z.string({ message: /*i18n*/("Name is required") })
    .min(2, /*i18n*/("Name must be at least 2 characters")),
  slug: tenantSlugSchema,
  description: z.string().nullable(),
  backgroundImage: z.string({ message: /*i18n*/("Background image is required") }),
  disabledAt: z.date().nullable(),
  createdAt: z.date({ message: /*i18n*/("Creation date is required") }),
  updatedAt: z.date().nullable(),
});
export type TenantSchema = z.infer<typeof tenantSchema>;

export const workspaceWithMemberCountSchema = tenantSchema.extend({
  memberCount: z.number({ message: /*i18n*/("Member count is required") })
});
export type WorkspaceWithMemberCountSchema = z.infer<typeof workspaceWithMemberCountSchema>;

export const createWorkspaceSchema = tenantSchema
  .omit({
    id: true,
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = tenantSchema
  .omit({
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const disableWorkspaceSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty")),
  password: z.string({ message: /*i18n*/("Password is required") })
    .trim(),
  confirmText: z.string({ message: /*i18n*/("Confirmation text is required") })
    .trim()
    .min(1, /*i18n*/("Confirmation text cannot be empty"))
});
export type DisableWorkspaceSchema = z.infer<typeof disableWorkspaceSchema>;