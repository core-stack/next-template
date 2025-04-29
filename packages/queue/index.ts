import { Queue } from "bullmq";
import { z } from "zod";

import { redisConnection } from "./redis";

export enum QueueName {
  EMAIL = 'email',
}

export enum EmailTemplate {
  FORGOT_PASSWORD = 'forgot-password',
  INVITE = 'invite',
  ACTIVE_ACCOUNT = 'active-account',
}

const emailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  template: z.nativeEnum(EmailTemplate),
  context: z.record(z.string()),
  from: z.string().optional(),
})
export type EmailPayload = z.infer<typeof emailPayloadSchema>;

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