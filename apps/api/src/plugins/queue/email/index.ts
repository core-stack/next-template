import { Job } from "bullmq";
import { FastifyInstance } from "fastify";

import { compiledTemplates, nodemailerTransporter } from "./mailer";
import { EmailPayload } from "./schema";

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