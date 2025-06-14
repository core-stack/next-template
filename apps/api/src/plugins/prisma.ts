import fp from 'fastify-plugin';

import { PrismaClient } from '@/__generated__/prisma';

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'DATABASE' });
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate('prisma', prisma);
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
  logger.info("Prisma plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}