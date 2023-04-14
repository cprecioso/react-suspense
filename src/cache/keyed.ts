import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export interface KeyedCacheStorage<K, T> {
  get(key: K): CacheValue<T> | undefined | null;
  set(key: K, value: CacheValue<T> | null): void;
}

export declare namespace KeyedCacheStorage {
  export type Any = KeyedCacheStorage<any, any>;

  export type KeyType<S extends Any> = S extends KeyedCacheStorage<infer K, any>
    ? K
    : never;

  export type ValueType<S extends Any> = S extends KeyedCacheStorage<
    any,
    infer T
  >
    ? T
    : never;
}

export type KeyedUseFn<K, T> = (key: K, fn: () => Promise<T>) => T;

export interface KeyedCache<Storage extends KeyedCacheStorage.Any> {
  storage: Storage;
  use: KeyedUseFn<
    KeyedCacheStorage.KeyType<Storage>,
    KeyedCacheStorage.ValueType<Storage>
  >;
}

export const createKeyedCacheWithStorage = <
  Storage extends KeyedCacheStorage.Any
>(
  storage: Storage
): KeyedCache<Storage> => ({
  storage,
  use: (key, fn) =>
    suspendOnPromise(fn, storage.get(key), (value) => storage.set(key, value)),
});

export const createKeyedCache = <K, T>() =>
  createKeyedCacheWithStorage(new Map<K, CacheValue<T>>());
