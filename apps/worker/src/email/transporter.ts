import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

import { env } from '@packages/env';

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
    partialsDir: path.resolve("src", "email", "templates"),
    layoutsDir: "",
    defaultLayout: "",
  },
  viewPath: path.resolve("src", "email", "templates"),
  extName: '.hbs',
}));