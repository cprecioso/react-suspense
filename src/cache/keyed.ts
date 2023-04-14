import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export interface KeyedCacheStorage<K, T> {
  get(key: K): CacheValue<T> | undefined | null;
  set(key: K, value: CacheValue<T>): void;
}

export const createKeyedCache = <K, T>(
  storage: KeyedCacheStorage<K, T> = new Map()
) => {
  const use = (key: K, fn: () => Promise<T>) =>
    suspendOnPromise(fn, storage.get(key), (value) => storage.set(key, value));

  return { use, storage };
};
