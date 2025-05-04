import { prisma } from '@packages/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type SendNotificationParams = {
  userId: string;
  title: string;
  description: string;
  link?: string;
  tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
}
export const sendNotification = async ({ description, title, userId, link, tx }: SendNotificationParams) => {
  const notification = await (tx ?? prisma).notification.create({
    data: { description, title, link: link || "", userId }
  });
  return notification;
}