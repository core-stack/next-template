import { z } from 'zod';

export const tenantSlugSchema = z
  .string({ message: /*i18n*/("Slug is required") })
  .min(2, /*i18n*/("Slug must be at least 2 characters"))
  .regex(/^[a-z0-9-]+$/, /*i18n*/("Slug can only contain lowercase letters, numbers and hyphens"));

export type TenantSlugSchema = z.infer<typeof tenantSlugSchema>;

export const tenantSlugParamsSchema = z.object({ slug: tenantSlugSchema });
export type TenantSlugParamsSchema = z.infer<typeof tenantSlugParamsSchema>;

export const tenantSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
  name: z.string({ message: /*i18n*/("Name is required") })
    .min(2, /*i18n*/("Name must be at least 2 characters")),
  slug: tenantSlugSchema,
  description: z.string().nullable(),
  disabledAt: z.date().nullable(),
  createdAt: z.date({ message: /*i18n*/("Creation date is required") }),
  updatedAt: z.date().nullable(),
});
export type TenantSchema = z.infer<typeof tenantSchema>;

export const getTenantsList = tenantSchema.extend({ membersCount: z.number().positive() }).array();
export type GetTenantsList = z.infer<typeof getTenantsList>;

export const workspaceWithMemberCountSchema = tenantSchema.extend({
  memberCount: z.number({ message: /*i18n*/("Member count is required") })
});
export type TenantWithMemberCountSchema = z.infer<typeof workspaceWithMemberCountSchema>;

export const createTenantSchema = tenantSchema
  .omit({
    id: true,
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type CreateTenantSchema = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = tenantSchema
  .omit({
    disabledAt: true,
    updatedAt: true,
    createdAt: true,
  });
export type UpdateTenantSchema = z.infer<typeof updateTenantSchema>;

export const disableTenantSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty")),
  password: z.string({ message: /*i18n*/("Password is required") })
    .trim(),
  confirmText: z.string({ message: /*i18n*/("Confirmation text is required") })
    .trim()
    .min(1, /*i18n*/("Confirmation text cannot be empty"))
});
export type DisableTenantSchema = z.infer<typeof disableTenantSchema>;