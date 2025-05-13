import { env } from '@packages/env';
import { prisma } from '@packages/prisma';
import { addInQueue, EmailTemplate, QueueName } from '@packages/queue';

export async function deleteDisabledWorkspaces() {
  const workspaces = await prisma.workspace.findMany({
    where: {
      disabledAt: {
        gte: new Date(Date.now() - env.DISABLED_WORKSPACES_DELETE_AFTER),
      },
    },
    include: {
      members: { where: { owner: true } },
    },
  });

  for (const workspace of workspaces) {
    await addInQueue(
      QueueName.EMAIL,
      {
        to: workspace.members[0].email,
        subject: "Seu workspace foi excluído",
        template: EmailTemplate.WORKSPACE_DELETED,
        context: {
          workspaceName: workspace.name,
        },
      }
    );

    await prisma.workspace.delete({
      where: {
        id: workspace.id,
      },
    });
  }
}
