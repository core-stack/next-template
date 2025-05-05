import { Job, Worker } from 'bullmq';
import nodemailer, { SendMailOptions } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

import { env } from '@packages/env';
import { EmailPayload, QueueName } from '@packages/queue';
import { redisConnection } from '@packages/queue/redis';

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
    partialsDir: path.resolve('./templates/email/'),
  },
  viewPath: path.resolve('./templates/email/'),
  extName: '.hbs',
}));

interface MailOptionsWithTemplate extends SendMailOptions {
  template: string;
  context: any;
}

const emailWorker = new Worker<EmailPayload>(
  QueueName.EMAIL,
  async (job: Job<EmailPayload>) => {
    console.log(job.data);

    const opts: MailOptionsWithTemplate = {
      ...job.data,
      from: job.data.from ?? env.SMTP_USER,
    }
    transporter.sendMail(opts);
  },
  { connection: redisConnection }
);

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});
