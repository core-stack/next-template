import nodemailer, { SendMailOptions } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

import { env } from '@/env/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve('../templates/email/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('../templates/email/'),
  extName: '.hbs',
}));

interface MailOptionsWithTemplate extends SendMailOptions {
  template: string;
  context: any;
}

export enum EmailTemplate {
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  ACTIVE_ACCOUNT = 'active-account',
}
export type EmailPayload = {
  to: string;
  subject: string;
  template: EmailTemplate;
  context: any;
  from?: string;
}
export const sendEmail = async ({ context, template, subject, to, from }: EmailPayload) => {
  const opts: MailOptionsWithTemplate = {
    from: from ?? env.SMTP_USER,
    to,
    subject,
    template,
    context
  }
  transporter.sendMail(opts);
}