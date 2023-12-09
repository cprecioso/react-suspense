export type CacheValue<T> =
  | { status: "waiting"; promise: Promise<unknown> }
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; error: unknown };

export type StoredCacheValue<T> = CacheValue<T> | null;

export interface CacheRef<T> {
  current: CacheValue<T> | null;
}

export const makeCacheRef = <T>(): CacheRef<T> => ({ current: null });
