import admin from "firebase-admin";

import { env } from "@/env";
import { prisma } from "@packages/prisma";

if (!admin.apps.length) {
  const projectId = env.FIREBASE_PROJECT_ID;
  const privateKey = env.FIREBASE_PRIVATE_KEY;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Missing Firebase Admin credentials');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail,
    }),
  });
}

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