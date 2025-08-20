import { FastifyInstance } from 'fastify';

import { hashPassword } from '@/plugins/auth/utils';
import { ROLES } from '@packages/permission';

export default async function seedDatabase({ prisma, log, env }: FastifyInstance) {
  log.info("Seeding database...");
  if ((await prisma.user.count()) === 0) {
    log.info("No users found, creating default user...");
    const adminRole = await prisma.role.findFirstOrThrow({ where: { key: ROLES.global.admin.key, scope: "GLOBAL" } });
    await prisma.user.create({
      data: {
        email: env.DEFAULT_USER_EMAIL,
        name: env.DEFAULT_USER_NAME,
        password: await hashPassword(env.DEFAULT_USER_PASSWORD),
        emailVerified: new Date(),
        createdAt: new Date(),
        role: {
          connect: {
            id: adminRole.id,
          }
        },
      }
    })
  }
  log.info("Database seeded successfully");
}