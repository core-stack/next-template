import fastifyCookiePlugin from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import { env } from "./env";
import { errorHandler } from "./error-handler";
import authPlugin from "./plugins/auth";
import bootstrapPlugin from "./plugins/bootstrap";
import cronPlugin from "./plugins/cron";
import envPlugin from "./plugins/env";
import i18nPlugin from "./plugins/i18n";
import prismaPlugin from "./plugins/prisma";
import queuePlugin from "./plugins/queue";
import routerPlugin from "./plugins/router";
import storagePlugin from "./plugins/storage";

async function main() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname,plugin',
          messageFormat: '[{plugin}] {msg}',
        }
      }
    }
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  });
  await app.register(i18nPlugin);
  await app.register(fastifyCookiePlugin, { secret: "supersecret", parseOptions: {} });
  await app.register(envPlugin);
  await app.register(prismaPlugin);
  await app.register(queuePlugin);
  await app.register(cronPlugin);
  app.setErrorHandler(errorHandler);
  await app.register(authPlugin, {
    jwt: {
      secret: env.JWT_SECRET,
      accessTokenDuration: env.JWT_ACCESS_TOKEN_DURATION,
      refreshTokenDuration: env.JWT_REFRESH_TOKEN_DURATION,
    },
    store: { type: env.AUTH_STORE_TYPE, options: { url: env.REDIS_URL } },
    providers: {}
  });
  await app.register(bootstrapPlugin);

  await app.register(storagePlugin, {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    endpoint: env.AWS_ENDPOINT,
    publicBaseURL: env.AWS_PUBLIC_BUCKET_BASE_URL,
    defaultBucket: env.AWS_BUCKET,
    region: env.AWS_REGION,
  });

  await app.register(routerPlugin);

  await app.listen({ port: env.API_PORT });
}
main();