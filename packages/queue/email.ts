import { z } from "zod";

export enum EmailTemplate {
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  ACTIVE_ACCOUNT = 'active-account',
  CHANGE_PASSWORD = 'change-password',
  CHANGE_EMAIL = 'change-email',

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
]);

export type EmailPayload = z.infer<typeof emailPayloadSchema>;
