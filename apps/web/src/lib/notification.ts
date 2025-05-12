import { prisma } from "@packages/prisma";

type SendNotificationParams = {
  destinationId: string;
  workspaceId: string;
  title: string;
  description: string;
  link?: string;
}
export const sendNotification = async ({ description, title, destinationId, workspaceId, link }: SendNotificationParams) => {
  const notification = await prisma.notification.create({
    data: { description, title, link: link || "", destinationId, workspaceId }
  });
  return notification;
}