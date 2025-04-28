import Redis from 'ioredis';

import { env } from '@/env/env';

export const redisConnection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });