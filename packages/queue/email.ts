import { z } from 'zod';

export enum EmailTemplate {
  ACTIVE_ACCOUNT = 'active-account',
  CHANGE_PASSWORD = 'change-password',
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  NOTIFICATION = 'notification',
  WORKSPACE_DELETED = 'workspace-deleted',
  WORKSPACE_REACTIVATED = 'workspace-reactivated',
  WORKSPACE_WILL_BE_DELETED = 'workspace-will-be-deleted', // 90 days before deletion
}

const forgotPasswordSchema = z.object({
  resetUrl: z.string().url(),
  name: z.string().nullable(),
});
const inviteSchema = z.object({
  workspaceName: z.string(),
  inviteUrl: z.string().url(),
});
const activeAccountSchema = z.object({
  activationUrl: z.string().url(),
  name: z.string().nullable(),
});
const changePasswordSchema = z.object({
  name: z.string().nullable(),
});
const notificationSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string().url().optional(),
  workspaceName: z.string(),
});
const workspaceDeletedSchema = z.object({
  workspaceName: z.string(),
});
const workspaceReactivatedSchema = z.object({
  workspaceName: z.string(),
  workspaceUrl: z.string().url(),
});
const workspaceWillBeDeletedSchema = z.object({
  workspaceName: z.string(),
  workspaceReactivateUrl: z.string().url(),
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
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.NOTIFICATION),
    context: notificationSchema,
  }),
]);

export type EmailPayload = z.infer<typeof emailPayloadSchema>;
