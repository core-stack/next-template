import fp from "fastify-plugin";

import { bootstrapGlobalRoles } from "./roles";

export default fp(async (app) => {
  if (!app.prisma) {
    throw new Error("Prisma client is not available in the app instance");
  }
  app.log.info("Registering bootstrap plugin");
  await bootstrapGlobalRoles(app);
  app.log.info("Bootstrap plugin registered successfully");
});