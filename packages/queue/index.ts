import { Queue } from 'bullmq';

import { EmailPayload, emailPayloadSchema } from './email';
import { redisConnection } from './redis';

export enum QueueName {
  EMAIL = 'email',
}

const schemaMap = {
  [QueueName.EMAIL]: emailPayloadSchema,
};

export type QueuesMap = {
  [QueueName.EMAIL]: EmailPayload;
};


const queues: Record<QueueName, Queue> = {
  [QueueName.EMAIL]: new Queue(QueueName.EMAIL, { connection: redisConnection }),
};

export function getQueue(queue: QueueName) {
  return queues[queue];
}
export function addInQueue<T extends QueueName>(queue: T, payload: QueuesMap[T]) {
  return getQueue(queue).add(queue, schemaMap[queue].parse(payload));
}

export * from "./email";