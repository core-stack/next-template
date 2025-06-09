import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { env } from '@packages/env';

import authPlugin from './plugins/auth';
import bootstrapPlugin from './plugins/bootstrap';
import envPlugin from './plugins/env';
import pathRegisterPlugin from './plugins/path-register';
import prismaPlugin from './plugins/prisma';
import storagePlugin from './plugins/storage';

async function main() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        }
      }
    }
  }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(fastifyCookie, { secret: "supersecret", parseOptions: {} });

  await app.register(envPlugin);
  await app.register(prismaPlugin);
  // await app.register(queuePlugin);
  // await app.register(cronPlugin);
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

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API Docs",
        description: "Documentação da API usando Zod + Fastify",
        version: "1.0.0",
      },
    },
    // transform: jsonSchemaTransform
  });
  
  await app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    logLevel: "silent",
  });
  
  await app.register(pathRegisterPlugin);

  await app.listen({ port: env.API_PORT });
}
main();