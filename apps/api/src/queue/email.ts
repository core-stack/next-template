import { Job } from 'bullmq';
import { FastifyInstance } from 'fastify';
import fs from 'fs';
import Handlebars from 'handlebars';
import nodemailer, { SendMailOptions } from 'nodemailer';
import path from 'path';

import { env } from '@/env';

import { EmailPayload } from './schemas/email';

const templatesDir = path.resolve('src/templates');
export const compiledTemplates: Record<string, HandlebarsTemplateDelegate> = {};

fs.readdirSync(templatesDir).forEach(file => {
  if (file.endsWith('.hbs')) {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(content);
    compiledTemplates[file.replace(".hbs", "")] = template;
  }
});

export const nodemailerTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export interface MailOptionsWithTemplate extends SendMailOptions {
  template: string;
  context: unknown;
}

export interface Transporter {
  sendMail: (opts: MailOptionsWithTemplate) => Promise<void>;
}

export default async function(app: FastifyInstance, job: Job<EmailPayload>) {
  const html = compiledTemplates[job.data.template](job.data.context);
  if (!app.env.SMTP_ENABLED) {
    app.log.debug("SMTP is disabled");
    app.log.info(job.data);
  } else {
    await nodemailerTransporter.sendMail({
      ...job.data,
      to: app.env.SMTP_ENV === "development" ? app.env.SMTP_TEST_EMAIL : job.data.to,
      from: job.data.from ?? app.env.SMTP_FROM,
      html,
    });
  }
}