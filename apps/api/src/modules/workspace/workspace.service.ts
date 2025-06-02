import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { env } from "@packages/env";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WorkspaceService {
  @Inject() private readonly prisma!: PrismaService;
  @Cron("0 0 * * *") // every day at 00:00
  async deleteDisabledWorkspaces() {
    const workspaces = await this.prisma.workspace.findMany({
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
}
