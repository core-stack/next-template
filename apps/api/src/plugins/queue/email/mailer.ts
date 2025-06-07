import { env } from "@packages/env";
import fs from "fs";
import Handlebars from "handlebars";
import nodemailer, { SendMailOptions } from "nodemailer";
import path from "path";

const templatesDir = path.join(__dirname, 'templates');
export const compiledTemplates: Record<string, HandlebarsTemplateDelegate> = {};

fs.readdirSync(templatesDir).forEach(file => {
  if (file.endsWith('.hbs')) {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(content);
    compiledTemplates[file] = template;
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