export type StoreOptions = {
  expiry?: number
}

export interface Store<T> {
  get(key: string): Promise<T | null>
  set(key: string, value: T, opts?: StoreOptions): Promise<void>
  delete(key: string): Promise<void>
}