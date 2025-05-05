import { z } from 'zod';

export enum EmailTemplate {
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  ACTIVE_ACCOUNT = 'active-account',
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
]);

export type EmailPayload = z.infer<typeof emailPayloadSchema>;
