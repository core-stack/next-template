import { JobsOptions, Queue } from 'bullmq';

import { EmailPayload, emailPayloadSchema } from './email';
import { CompressImagePayload, compressImageSchema } from './image-compressor';
import { redisConnection } from './redis';

export enum QueueName {
  EMAIL = 'email',
  COMPRESS_IMAGE = 'compress-image',
}

const schemaMap = {
  [QueueName.EMAIL]: emailPayloadSchema,
  [QueueName.COMPRESS_IMAGE]: compressImageSchema,
};

export type QueuesMap = {
  [QueueName.EMAIL]: EmailPayload;
  [QueueName.COMPRESS_IMAGE]: CompressImagePayload;
};


const queues: Record<QueueName, Queue> = {
  [QueueName.EMAIL]: new Queue(QueueName.EMAIL, { connection: redisConnection }),
  [QueueName.COMPRESS_IMAGE]: new Queue(QueueName.COMPRESS_IMAGE, { connection: redisConnection }),
};

export function getQueue(queue: QueueName) {
  return queues[queue];
}
export function addInQueue<T extends QueueName>(
  queue: T,
  payload: QueuesMap[T],
  opts: JobsOptions = { backoff: { type: "fixed", delay: 1000 * 60 } } // repeat every minute if fails
) {
  return getQueue(queue).add(queue, schemaMap[queue].parse(payload), opts);
}

export * from "./email";
export * from "./image-compressor";