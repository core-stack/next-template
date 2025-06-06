import { Store, StoreOptions } from "./types";

export class MemoryStore<T> implements Store<T> {
  private store: Record<string, { data: T; expiresAt?: number }> = {};

  get(key: string): T | null {
    const item = this.store[key];
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      delete this.store[key];
      return null;
    }
    return item.data;
  }

  set(key: string, value: T, opts?: StoreOptions): void {
    this.store[key] = { data: value, expiresAt: opts?.expiry ? Date.now() + opts.expiry : undefined };
  }

  delete(key: string): void {
    delete this.store[key];
  }
}
