import { Job, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq';
import { FastifyInstance } from 'fastify';

import { redisConnection } from '@/config/redis';

export const addQueue = <T>(
  name: string,
  app: FastifyInstance,
  process: (app: FastifyInstance, job: Job<T>) => Promise<void>,
  opts?: { queueOpts: QueueOptions, workerOpts?: WorkerOptions }
) => {
  app.log.info(`[PLUGIN] Adding queue: ${name}`);
  const queue = new Queue<T>(name, { ...opts?.queueOpts, connection: redisConnection });

  const worker = new Worker<T>(
    name,
    process.bind(null, app),
    { ...opts?.workerOpts, connection: redisConnection }
  );
  worker.on("completed", (job) => {
    app.log.debug(`[PLUGIN] Job ${job.id} completed successfully`);
  });
  worker.on("failed", (job, err) => {
    app.log.error(`[PLUGIN] Job ${job?.id} failed with error: ${err.message}`);
  });
  return { queue, worker };
}