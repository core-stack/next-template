import { Job, Queue, QueueOptions, RedisOptions, Worker, WorkerOptions } from 'bullmq';
import { FastifyInstance } from 'fastify';

export const addQueue = <T>(
  name: string,
  app: FastifyInstance,
  process: (app: FastifyInstance, job: Job<T>) => Promise<void>,
  opts?: { queueOpts?: QueueOptions, workerOpts?: WorkerOptions }
) => {
  const redisConnection: RedisOptions = { url: app.env.REDIS_URL };

  app.log.info(`Adding queue: ${name}`);
  const queue = new Queue<T>(name, { ...opts?.queueOpts, connection: redisConnection });

  const worker = new Worker<T>(
    name,
    process.bind(null, app),
    { ...opts?.workerOpts, connection: redisConnection }
  );
  worker.on("completed", (job) => {
    app.log.info(`Job ${job.id} completed successfully`);
  });
  worker.on("failed", (job, err) => {
    app.log.error(`Job ${job?.id} failed with error: ${err.message}`);
  });
  return { queue, worker };
}