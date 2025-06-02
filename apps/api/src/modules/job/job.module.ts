import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { env } from "@packages/env";
import { join } from "path";

import { CompressImageProcessor } from "./compress-image.processor";
import { EmailProcessor } from "./email.processor";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: env.SMTP_FROM,
        },
        template: {
          dir: join(__dirname + "/../../templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],

  providers: [EmailProcessor, CompressImageProcessor],
})
export class JobModule {}
