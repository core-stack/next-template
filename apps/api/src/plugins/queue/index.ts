import { Queue, QueueOptions as BullQueueOptions, WorkerOptions } from 'bullmq';
import FastGlob from 'fast-glob';
import fp from 'fastify-plugin';
import path from 'path';

import { CompressImagePayload } from '@/queue/image-compressor';
import { EmailPayload } from '@/queue/schemas/email';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';

import { addQueue } from './queue';

type Queues = {
  email: Queue<EmailPayload>;
  ["compress-image"]: Queue<CompressImagePayload>;
};

export type QueueOptions = {
  ignore?: boolean
  queueOpts?: BullQueueOptions
  workerOpts?: WorkerOptions
}

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'QUEUE' });

  const isProd = process.env.NODE_ENV === 'production';
  const baseDir = path.resolve(isProd ? 'dist/queue' : 'src/queue');
  const ext = isProd ? '*.js' : '*.ts';
  
  const files = await FastGlob(ext, { cwd: baseDir, absolute: true });
  if (files.length === 0) {
    logger.warn("No queue found");
    return;
  }
  const queues = [];
  for (const file of files) {
    const parsed = path.parse(file);
    const mod = await import(file);
    if (!mod.default) {
      logger.error(`Queue ${parsed.name} has no default export`);
      continue;
    }

    const job = mod.default;
    const options: QueueOptions = mod.options || {};

    if (typeof job !== "function") {
      logger.error(`Queue ${parsed.name} is not a valid function`);
      continue;
    }
    if (options.ignore) {
      logger.warn(`Queue ${parsed.name} is ignored`);
      continue;
    }

    try {
      const { queue } = addQueue(
        parsed.name, 
        { ...app, log: logger }, 
        job, 
        { queueOpts: options.queueOpts, workerOpts: options.workerOpts }
      );
      queues.push(queue);
    } catch (err) {
      logger.error(`Queue ${parsed.name} failed with error: ${err}`);
    }
  }
  const q = queues.reduce((acc, q) => ({ ...acc, [q.name]: q }), {}) as Queues;
  app.decorate('queue', q);

  const serverAdapter = new FastifyAdapter();
  createBullBoard({
    queues: queues.map((q) => new BullMQAdapter(q)),
    serverAdapter,
  });

  serverAdapter.setBasePath('/admin/bull-board');
  app.register(serverAdapter.registerPlugin(), { basePath: '/admin/bull-board', prefix: '/admin/bull-board' });
});

declare module 'fastify' {
  interface FastifyInstance { queue: Queues }
}