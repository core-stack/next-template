import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import { Queue } from "bullmq";
import fp from "fastify-plugin";

import emailProcess from "./email";
import { EmailPayload } from "./email/schema";
import compressImageProcess from "./image-compressor";
import { CompressImagePayload } from "./image-compressor/schema";
import { addQueue } from "./queue";

export default fp(async (app) => {
  app.log.info("[PLUGIN] Registering queue plugin");
  const email = addQueue<EmailPayload>("email", app, emailProcess);
  const compressImage = addQueue<CompressImagePayload>("compress-image", app, compressImageProcess);
  app.decorate('queue', { email: email.queue, compressImage: compressImage.queue });

  const serverAdapter = new FastifyAdapter();
  const queues = [compressImage.queue, email.queue];
  createBullBoard({
    queues: queues.map((q) => new BullMQAdapter(q)),
    serverAdapter,
  });

  serverAdapter.setBasePath('/admin/bull-board');
  app.register(serverAdapter.registerPlugin(), { basePath: '/admin/bull-board', prefix: '/admin/bull-board' });

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