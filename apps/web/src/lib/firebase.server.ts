import admin from "firebase-admin";

import { env } from "@/env";

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

export default admin;