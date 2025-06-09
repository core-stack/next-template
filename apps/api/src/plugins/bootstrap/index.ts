import fp from "fastify-plugin";

import { bootstrapGlobalRoles } from "./roles";

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'BOOTSTRAP' });

  if (!app.prisma) {
    throw new Error("Prisma client is not available in the app instance");
  }
  logger.info("Registering bootstrap plugin");
  await bootstrapGlobalRoles(app);
  logger.info("Bootstrap plugin registered successfully");
});