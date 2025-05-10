import { prisma } from '@packages/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type SendNotificationParams = {
  destinationId: string;
  workspaceId: string;
  title: string;
  description: string;
  link?: string;
  tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
}
export const sendNotification = async ({ description, title, destinationId, workspaceId, link, tx }: SendNotificationParams) => {
  const notification = await (tx ?? prisma).notification.create({
    data: { description, title, link: link || "", destinationId, workspaceId }
  });
  return notification;
}