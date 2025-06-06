import { PrismaClient } from "@/generated/prisma";
import fp from "fastify-plugin";

export default fp(async (app) => {
  app.log.info("Registering Prisma plugin");
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate('prisma', prisma);
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
  app.log.info("Prisma plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}