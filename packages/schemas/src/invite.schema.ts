import { z } from 'zod';

export const inviteSchema = z.object({
  id: z.string().uuid(/*i18n*/("ID must be a valid UUID")),
  workspaceId: z.string().uuid(/*i18n*/("Workspace ID must be a valid UUID")),
  email: z.string().email(/*i18n*/("The email is invalid")),
  roleId: z.string().uuid(/*i18n*/("Role ID must be a valid UUID")),
  userId: z.string().uuid(/*i18n*/("User ID must be a valid UUID")).nullable(),
  expiresAt: z.date({ message: /*i18n*/("Expiration date is required") }),
  createdAt: z.date({ message: /*i18n*/("Creation date is required") }),
  updatedAt: z.date({ message: /*i18n*/("Update date must be a valid date") }).nullable(),
});
export type InviteSchema = z.infer<typeof inviteSchema>;

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

export const getInviteByWorkspaceSchema = z.object({
  slug: z.string({ message: /*i18n*/("Slug is required") })
    .trim()
    .min(1, /*i18n*/("Slug cannot be empty"))
});

export type GetInviteByWorkspaceSchema = z.infer<typeof getInviteByWorkspaceSchema>;