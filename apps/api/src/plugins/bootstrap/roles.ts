import { FastifyInstance } from 'fastify';

import { permissionsToNumber, ROLES } from '@packages/permission';

export const bootstrapGlobalRoles = async ({ prisma, log }: FastifyInstance) => {
  log.info("[PLUGIN] Bootstrapping global roles...");
  if (!prisma) {
    log.error("[PLUGIN] Prisma client is not available. Skipping global roles bootstrap.");
    return;
  }
  try {
    const existingRoles = await prisma.role.findMany({ where: { scope: "GLOBAL" } });
    log.info(`[PLUGIN] Found ${existingRoles.length} existing global roles.`);
    for (const role of ROLES.global.default) {
      const existing = existingRoles.find(r => r.key === role.key);

      if (!existing) {
        log.info(`[PLUGIN] Creating global role: ${role.name}`);
        await prisma.role.create({
          data: {
            key: role.key,
            name: role.name,
            permissions: role.permissions.reduce((acc, p) => acc | p, 0),
            scope: "GLOBAL"
          }
        });
        log.info(`[PLUGIN] Created global role: ${role.name}`);
      } else {
        if (existing.name === role.name && existing.permissions === permissionsToNumber(role.permissions)) {
          continue; // No changes needed
        }
        log.info(`[PLUGIN] Updating global role: ${role.name}`);
        // Update existing role if name or permissions have changed
        await prisma.role.update({
          where: { id: existing.id },
          data: {
            name: role.name,
            permissions: permissionsToNumber(role.permissions),
          }
        });
        log.info(`[PLUGIN] Updated global role: ${role.name}`);
      }
    }
  } catch (error) {
    log.error(`[PLUGIN] Error bootstrapping global roles: ${error}`);
    throw error; // Re-throw to ensure the error is handled by the caller
  }
}