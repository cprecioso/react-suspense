import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export interface KeyedCacheStorage<K, T> {
  get(key: K): CacheValue<T> | undefined | null;
  set(key: K, value: CacheValue<T> | null): void;
}

export type KeyedUseFn<K, T> = (key: K, fn: () => Promise<T>) => T;

export interface KeyedCache<K, T> {
  cache: KeyedCacheStorage<K, T>;
  suspend: KeyedUseFn<K, T>;
}

export const createKeyedSuspense = <K, T>({
  storage = new Map<K, CacheValue<T>>(),
}: { storage?: KeyedCacheStorage<K, T> } = {}): KeyedCache<K, T> => ({
  cache: storage,
  suspend: (key, fn) =>
    suspendOnPromise(fn, storage.get(key), (value) => storage.set(key, value)),
});
