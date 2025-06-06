import { z } from "zod";

export enum EmailTemplate {
  ACTIVE_ACCOUNT = "active-account",
  CHANGE_PASSWORD = "change-password",
  FORGOT_PASSWORD = "forgot-password",
  INVITE = "invite",
  NOTIFICATION = "notification",
  TENANT_DELETED = "tenant-deleted",
  TENANT_REACTIVATED = "tenant-reactivated",
  TENANT_WILL_BE_DELETED = "tenant-will-be-deleted", // days after deletion
}

const forgotPasswordSchema = z.object({
  resetUrl: z.string().url(),
  name: z.string().nullable(),
});
const inviteSchema = z.object({
  tenantName: z.string(),
  inviteUrl: z.string().url(),
  role: z.string(),
  inviterName: z.string(),
  expirationDate: z.string(),
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
  tenantName: z.string(),
});
const tenantDeletedSchema = z.object({
  tenantName: z.string(),
});
const tenantReactivatedSchema = z.object({
  tenantName: z.string(),
  tenantUrl: z.string().url(),
});
const tenantWillBeDeletedSchema = z.object({
  tenantName: z.string(),
  tenantReactivateUrl: z.string().url(),
});

export const emailPayloadSchema = z.discriminatedUnion("template", [
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
    template: z.literal(EmailTemplate.TENANT_DELETED),
    context: tenantDeletedSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.TENANT_REACTIVATED),
    context: tenantReactivatedSchema,
  }),
  z.object({
    to: z.string().email(),
    subject: z.string(),
    from: z.string().optional(),
    template: z.literal(EmailTemplate.TENANT_WILL_BE_DELETED),
    context: tenantWillBeDeletedSchema,
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
