import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import fastifyCookie from '@fastify/cookie';
import { env } from '@packages/env';

import authPlugin from './plugins/auth';
import bootstrapPlugin from './plugins/bootstrap';
import cronPlugin from './plugins/cron';
import envPlugin from './plugins/env';
import prismaPlugin from './plugins/prisma';
import queuePlugin from './plugins/queue';
import routerPlugin from './plugins/router';
import storagePlugin from './plugins/storage';

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
  app.setErrorHandler((error, _, reply) => {
    if (error.validation) {
      const fields = error.validation.map((err: any) => ({
        [err.instancePath.replace('/', '')]: err.message
      }))

      reply.status(400).send({
        status: 400,
        message: 'Validation error',
        errors: { fields },
      })
      return
    }

    reply.status(500).send({ status: 500, message: 'Internal Server Error' })
  })

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(fastifyCookie, { secret: "supersecret", parseOptions: {} });

  await app.register(envPlugin);
  await app.register(prismaPlugin);
  await app.register(queuePlugin);
  await app.register(cronPlugin);
  await app.register(authPlugin, {
    jwt: {
      secret: env.JWT_SECRET,
      accessTokenDuration: env.JWT_ACCESS_TOKEN_DURATION,
      refreshTokenDuration: env.JWT_REFRESH_TOKEN_DURATION,
    },
    store: { type: "redis", options: { url: env.REDIS_URL } },
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