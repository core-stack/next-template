import { Queue } from 'bullmq';
import fp from 'fastify-plugin';

import emailProcess from './email';
import { EmailPayload } from './email/schema';
import compressImageProcess from './image-compressor';
import { CompressImagePayload } from './image-compressor/schema';
import { addQueue } from './queue';

export default fp(async (app) => {
  app.log.info("[PLUGIN] Registering queue plugin");
  const email = addQueue<EmailPayload>("email", app, emailProcess);
  const compressImage = addQueue<CompressImagePayload>("compress-image", app, compressImageProcess);
  app.decorate('queue', { email: email.queue, compressImage: compressImage.queue });
  app.log.info("[PLUGIN] Queue plugin registered successfully");
});

declare module 'fastify' {
  interface FastifyInstance {
    queue: {
      email: Queue<EmailPayload>;
      compressImage: Queue<CompressImagePayload>;
    };
  }
}