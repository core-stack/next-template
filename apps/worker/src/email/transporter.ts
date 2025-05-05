import { env } from "@packages/env";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

export const nodemailerTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

nodemailerTransporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve('./templates/email/'),
  },
  viewPath: path.resolve('./templates/email/'),
  extName: '.hbs',
}));