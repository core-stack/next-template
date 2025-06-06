import { Job } from "bullmq";
import { FastifyInstance } from "fastify";

import { compiledTemplates, MailOptionsWithTemplate, nodemailerTransporter } from "./mailer";
import { EmailPayload } from "./schema";

export default async function(app: FastifyInstance, job: Job<EmailPayload>) {
  const opts: MailOptionsWithTemplate = {
    ...job.data,
    to: app.env.SMTP_ENV === "development" ? app.env.SMTP_TEST_EMAIL : job.data.to,
    from: job.data.from ?? app.env.SMTP_FROM,
    template: compiledTemplates[job.data.template].toString(),
  }

  if (!app.env.SMTP_ENABLED) {
    app.log.debug("SMTP is disabled");
    app.log.info(job.data);
  } else {
    await nodemailerTransporter.sendMail(opts);
  }
}