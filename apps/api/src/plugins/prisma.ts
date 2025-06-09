import fp from 'fastify-plugin';

import { PrismaClient } from '@/generated/prisma';

export default fp(async (app) => {
  app.log.info("[PLUGIN] Registering Prisma plugin");
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate('prisma', prisma);
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
  app.log.info("[PLUGIN] Prisma plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}