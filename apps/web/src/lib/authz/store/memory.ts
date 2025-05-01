import { Store, StoreOptions } from './types';

export class MemoryStore<T> implements Store<T> {
  private store: Record<string, { data: T, expiresAt?: number }> = {};
  async get(key: string): Promise<T | null> {
    const item = this.store[key];
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      delete this.store[key];
      return null;
    }
    return item.data;
  }
  async set(key: string, value: T, opts?: StoreOptions): Promise<void> {
    this.store[key] = { data: value, expiresAt: opts?.expiry ? Date.now() + opts.expiry : undefined };
  }
  async delete(key: string): Promise<void> {
    delete this.store[key];
  }

}