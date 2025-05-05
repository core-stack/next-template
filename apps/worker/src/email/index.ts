import { env } from "@packages/env";
import { EmailPayload, QueueName } from "@packages/queue";
import { redisConnection } from "@packages/queue/redis";
import { Job, Worker } from "bullmq";

import { MailOptionsWithTemplate, Transporter } from "./types";

const lazyTransporter: Promise<Transporter> | undefined = env.SMTP_ENABLED ?
  import("./transporter").then((m) => m.nodemailerTransporter) : undefined;

const emailWorker = new Worker<EmailPayload>(
  QueueName.EMAIL,
  async (job: Job<EmailPayload>) => {

    const opts: MailOptionsWithTemplate = {
      ...job.data,
      from: job.data.from ?? env.SMTP_USER,
    }
    const transporter = await lazyTransporter
    if (!transporter) {
      console.warn("SMTP is disabled");
      console.log(job.data);
    } else {
      await transporter.sendMail(opts);
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
