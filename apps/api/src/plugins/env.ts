import { env } from "@packages/env";
import fp from "fastify-plugin";

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'ENV' });

  logger.info("Registering env plugin");
  app.decorate("env", env);
  logger.info("Env plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    env: typeof env;
  }
}