import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { env } from "@packages/env";
import { Job } from "bullmq";

import { EmailPayload } from "./email.types";
import { QueueName } from "./types";

@Processor(QueueName.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  @Inject() private readonly mailer: MailerService;

  async process(job: Job<EmailPayload>) {
    if (env.SMTP_ENV === "development") this.logger.log(job.data);

    await this.mailer.sendMail({
      ...job.data,
      to: env.SMTP_ENV === "development" ? env.SMTP_TEST_EMAIL : job.data.to,
      from: job.data.from ?? env.SMTP_FROM,
    });
  }
}
