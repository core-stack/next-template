import { FastifyInstance } from 'fastify';

import { permissionsToNumber, ROLES } from '@packages/permission';

export default async function bootstrapGlobalRoles({ prisma, log }: FastifyInstance) {
  log.info("Bootstrapping global roles...");
  if (!prisma) {
    log.error("Prisma client is not available. Skipping global roles bootstrap.");
    return;
  }
  try {
    const existingRoles = await prisma.role.findMany({ where: { scope: "GLOBAL" } });
    log.info(`Found ${existingRoles.length} existing global roles.`);
    for (const role of ROLES.global.default) {
      const existing = existingRoles.find(r => r.key === role.key);

      if (!existing) {
        log.info(`Creating global role: ${role.name}`);
        await prisma.role.create({
          data: {
            key: role.key,
            name: role.name,
            permissions: role.permissions.reduce((acc, p) => acc | p, 0),
            scope: "GLOBAL"
          }
        });
        log.info(`Created global role: ${role.name}`);
      } else {
        if (existing.name === role.name && existing.permissions === permissionsToNumber(role.permissions)) {
          continue; // No changes needed
        }
        log.info(`Updating global role: ${role.name}`);
        // Update existing role if name or permissions have changed
        await prisma.role.update({
          where: { id: existing.id },
          data: {
            name: role.name,
            permissions: permissionsToNumber(role.permissions),
          }
        });
        log.info(`Updated global role: ${role.name}`);
      }
    }
  } catch (error) {
    log.error(`Error bootstrapping global roles: ${error}`);
    throw error; // Re-throw to ensure the error is handled by the caller
  }
}