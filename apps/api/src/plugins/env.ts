import fp from 'fastify-plugin';

import { env, Env } from '@/env';

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'ENV' });
  app.decorate("env", env);
  logger.info("Env plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
  }
}