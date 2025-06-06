import fp from "fastify-plugin";
import cron from "node-cron";

import { deleteTenant } from "./delete-tenant";

export default fp(async (app) => {
  app.log.info("Registering cron plugin");
  cron.schedule('0 0 * * *', async () => { // Every day at midnight
    app.log.info("Running cron job to delete disabled tenants");
    deleteTenant(app, app.env.DISABLED_WORKSPACES_DELETE_AFTER);
    app.log.info("Cron job completed");
  });
  app.log.info("Cron plugin registered successfully");
});
