import { Job, Worker } from "bullmq";
import fs from "fs";
import Handlebars from "handlebars";
import { SendMailOptions } from "nodemailer";
import path from "path";

import { env } from "@packages/env";
import { EmailPayload, QueueName } from "@packages/queue";
import { redisConnection } from "@packages/queue/redis";

import { nodemailerTransporter } from "./transporter";

const templatesDir = path.join(__dirname, 'templates');

const compiledTemplates: Record<string, HandlebarsTemplateDelegate> = {};

fs.readdirSync(templatesDir).forEach(file => {
  if (file.endsWith('.hbs')) {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(content);
    compiledTemplates[file.replace('.hbs', '')] = template;
  }
});

const emailWorker = new Worker<EmailPayload>(
  QueueName.EMAIL,
  async (job: Job<EmailPayload>) => {
    console.log(compiledTemplates[job.data.template](job.data));

    const opts: SendMailOptions = {
      ...job.data,
      to: env.SMTP_ENV === "development" ? env.SMTP_TEST_EMAIL : job.data.to,
      from: job.data.from ?? env.SMTP_FROM,
      html: compiledTemplates[job.data.template](job.data),
    }

    if (!env.SMTP_ENABLED) {
      console.warn("SMTP is disabled");
      console.log(job.data);
      console.log(opts);
    } else {
      console.log(opts);
      await nodemailerTransporter.sendMail(opts);
    }
  },
  { connection: redisConnection }
);

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});
