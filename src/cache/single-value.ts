import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export interface SingleValueCacheStorage<T> {
  get(): CacheValue<T> | undefined | null;
  set(value: CacheValue<T> | null): void;
}

export declare namespace SingleValueCacheStorage {
  export type Any = SingleValueCacheStorage<any>;

  export type ValueType<S extends Any> = S extends SingleValueCacheStorage<
    infer T
  >
    ? T
    : never;
}

export type SingleValueUseFn<T> = (fn: () => Promise<T>) => T;

export interface SingleValueCache<Storage extends SingleValueCacheStorage.Any> {
  storage: Storage;
  use: SingleValueUseFn<SingleValueCacheStorage.ValueType<Storage>>;
}

export const createSingleValueCacheWithStorage = <
  Storage extends SingleValueCacheStorage.Any
>(
  storage: Storage
): SingleValueCache<Storage> => ({
  storage,
  use: (fn) => suspendOnPromise(fn, storage.get(), storage.set),
});

const makeSimpleStorage = <T>(): SingleValueCacheStorage<T> => {
  let storage: CacheValue<T> | null;

  return {
    get: () => storage,
    set: (value) => {
      storage = value;
    },
  };
};

export const createSingleValueCache = <T>() =>
  createSingleValueCacheWithStorage(makeSimpleStorage<T>());
