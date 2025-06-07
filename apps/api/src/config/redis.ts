import { env } from "@packages/env";
import { RedisOptions } from "bullmq";

const url = new URL(env.REDIS_URL);
export const redisConnection: RedisOptions = {
  host: url.host || 'localhost',
  port: parseInt(url.port || '6379', 10),
};
