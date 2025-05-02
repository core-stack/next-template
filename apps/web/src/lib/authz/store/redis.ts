import Redis from 'ioredis';

import { env } from '@/env';

import { Store, StoreOptions } from './types';

export class RedisStore<T> implements Store<T> {
  private redis: Redis;

  constructor(private prefix: string = "store") {
    this.redis = new Redis(env.REDIS_URL);
  }
  
  private makeKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async get(key: string): Promise<T | null> {
    const data = await this.redis.get(this.makeKey(key))
    if (!data) return null;
    return JSON.parse(data) as T; 
  }
  
  async set(key: string, value: T, opts?: StoreOptions): Promise<void> {
    if (opts?.expiry) {
      await this.redis.set(this.makeKey(key), JSON.stringify(value), "EX", opts.expiry);
    } else {
      const ttl = await this.redis.ttl(this.makeKey(key));
      if (ttl > 0) {
        await this.redis.set(this.makeKey(key), JSON.stringify(value), "KEEPTTL");
      } else {
        await this.redis.set(this.makeKey(key), JSON.stringify(value)); // sem TTL
      }
    }    
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.makeKey(key));
  }

}