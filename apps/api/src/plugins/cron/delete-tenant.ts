import { FastifyInstance } from "fastify";

import { EmailTemplate } from "../queue/email/schema";

export const deleteTenant = async (app: FastifyInstance, deleteDisabledWorkspaceAfterDays: number) => {
  const tenants = await app.prisma.tenant.findMany({
    where: {
      disabledAt: {
        gte: new Date(Date.now() - deleteDisabledWorkspaceAfterDays * 24 * 60 * 60 * 1000), // days
      },
    },
    include: {
      members: { where: { owner: true } },
    },
  });

  for (const tenant of tenants) {
    await app.queue.email.add("", {
      to: tenant.members[0].email,
      subject: "Seu workspace foi excluído",
      template: EmailTemplate.TENANT_DELETED,
      context: {
        tenantName: tenant.name,
      },
    });

    await app.prisma.tenant.delete({ where: { id: tenant.id } });
  }
}