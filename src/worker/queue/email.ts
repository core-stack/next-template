import { Queue } from 'bullmq';

import { redisConnection } from '../redis';
import { QueueType } from '../types';

export const emailQueue = new Queue(
  QueueType.EMAIL,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    }
  }
);