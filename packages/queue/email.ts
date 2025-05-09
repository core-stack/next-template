import { z } from 'zod';

export enum EmailTemplate {
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  ACTIVE_ACCOUNT = 'active-account',
  CHANGE_PASSWORD = 'change-password',
  CHANGE_EMAIL = 'change-email',
  WORKSPACE_DELETED = 'workspace-deleted',
  WORKSPACE_REACTIVATED = 'workspace-reactivated',
  WORKSPACE_WILL_BE_DELETED = 'workspace-will-be-deleted', // 90 days before deletion
}

const forgotPasswordSchema = z.object({
  resetUrl: z.string().url(),
});
const inviteSchema = z.object({
  workspaceName: z.string(),
  inviteUrl: z.string().url(),
});
const activeAccountSchema = z.object({
  activationUrl: z.string().url(),
});
const changePasswordSchema = z.object({
  name: z.string().nullable(),
});
const changeEmailSchema = z.object({
  name: z.string().nullable(),
  newEmail: z.string().email(),
});
const workspaceDeletedSchema = z.object({
  workspaceName: z.string(),
});
const workspaceReactivatedSchema = z.object({
  workspaceName: z.string(),
});
const workspaceWillBeDeletedSchema = z.object({
  workspaceName: z.string(),
});

export const emailPayloadSchema = z.discriminatedUnion('template', [
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.FORGOT_PASSWORD),
    context: forgotPasswordSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.INVITE),
    context: inviteSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.ACTIVE_ACCOUNT),
    context: activeAccountSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.CHANGE_PASSWORD),
    context: changePasswordSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.CHANGE_EMAIL),
    context: changeEmailSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.WORKSPACE_DELETED),
    context: workspaceDeletedSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.WORKSPACE_REACTIVATED),
    context: workspaceReactivatedSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.WORKSPACE_WILL_BE_DELETED),
    context: workspaceWillBeDeletedSchema,
  }),
]);

export type EmailPayload = z.infer<typeof emailPayloadSchema>;
