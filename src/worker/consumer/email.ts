import { Job, Worker } from 'bullmq';

import { EmailPayload, sendEmail } from '@/lib/email';

import { redisConnection } from '../redis';
import { QueueType } from '../types';

export const emailConsumer = new Worker(
  QueueType.EMAIL,
  async (job: Job<EmailPayload>) => {
    console.log('Email job started');
    await sendEmail(job.data);
    console.log('Email job completed');
  },
  {
    connection: redisConnection,
    concurrency: 1,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 }
  }
)

console.log('Email consumer started');