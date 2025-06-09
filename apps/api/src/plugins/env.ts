import fp from 'fastify-plugin';

import { env } from '@packages/env';

export default fp(async (app) => {
  app.log.info("[PLUGIN] Registering env plugin");
  app.decorate("env", env);
  app.log.info("[PLUGIN] Env plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    env: typeof env;
  }
}