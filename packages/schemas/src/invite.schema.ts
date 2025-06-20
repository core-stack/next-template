import { z } from 'zod';

import { inviteSchema, tenantSchema } from './models';

export const inviteMemberSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty")),
  emails: z.array(
    z.object({
      email: z.string({ message: /*i18n*/("Email is required") })
        .email(/*i18n*/("The email is invalid")),
      role: z.string({ message: /*i18n*/("Role is required") })
        .uuid(/*i18n*/("Role must be a valid UUID")),
    }),
    { message: /*i18n*/("At least one email is required") }
  ).min(1, /*i18n*/("At least one email is required"))
});
export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const deleteInviteSchema = z.object({
  id: z.string().uuid(/*i18n*/("ID must be a valid UUID")),
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export type DeleteInviteSchema = z.infer<typeof deleteInviteSchema>;

export const getInviteSchema = z.object({
  id: z.string().uuid(/*i18n*/("ID must be a valid UUID")),
});

export type GetInviteSchema = z.infer<typeof getInviteSchema>;


export const inviteWithTenantSchema = inviteSchema.extend({
  tenant: tenantSchema
});
export type InviteWithTenantSchema = z.infer<typeof inviteWithTenantSchema>;