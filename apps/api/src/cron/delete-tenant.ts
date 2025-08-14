import { FastifyInstance } from 'fastify';

import { CronJobOptions } from '@/plugins/cron/types';
import { EmailTemplate } from '@/queue/schemas/email';

export default async function cron (app: FastifyInstance) {
  const tenants = await app.prisma.tenant.findMany({
    where: {
      disabledAt: {
        gte: new Date(Date.now() - app.env.DISABLED_TENANTS_DELETE_AFTER),
      },
    },
    include: {
      members: { where: { owner: true } },
    },
  });

  for (const tenant of tenants) {
    await app.queue.email.add("", {
      to: tenant.members[0].email,
      subject: "Tenant excluído",
      template: EmailTemplate.TENANT_DELETED,
      context: {
        tenantName: tenant.name,
      },
    });

    await app.prisma.tenant.delete({ where: { id: tenant.id } });
  }
}

export const options: CronJobOptions = {
  schedule: "0 0 * * *", // Daily at midnight
  timezone: "UTC",
}