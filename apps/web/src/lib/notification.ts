import { prisma } from "@packages/prisma";

import admin from "./firebase.server";

type SendNotificationParams = {
  destinations: { id: string, token: string }[];
  workspaceId: string;
  title: string;
  description: string;
  link?: string;
}
export const sendNotification = async ({ description, title, destinations, workspaceId, link }: SendNotificationParams) => {
  const notifications = await prisma.notification.createMany({
    data: destinations.map(d => ({ description, title, link: link || "", destinationId: d.id, workspaceId }))
  });
  await admin.messaging().sendEach(destinations.map(d => ({
    notification: { title, body: description },
    data: link ? { url: link } : undefined,
    token: d.token,
  })));
  return notifications;
}