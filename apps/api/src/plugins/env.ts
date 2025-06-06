import { env } from "@packages/env";
import fp from "fastify-plugin";

export default fp(async (app) => {
  app.log.info("Registering env plugin");
  app.decorate("env", env);
  app.log.info("Env plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    env: typeof env;
  }
}