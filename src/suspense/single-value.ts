import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export interface SingleValueCacheStorage<T> {
  get(): CacheValue<T> | undefined | null;
  set(value: CacheValue<T> | null): void;
}

export type SingleValueUseFn<T> = (fn: () => Promise<T>) => T;

export interface SingleValueCache<T> {
  cache: SingleValueCacheStorage<T>;
  suspend: SingleValueUseFn<T>;
}

const makeSimpleStorage = <T>(): SingleValueCacheStorage<T> => {
  let storage: CacheValue<T> | null;

  return {
    get: () => storage,
    set: (value) => {
      storage = value;
    },
  };
};

export const createSuspense = <T>({
  storage = makeSimpleStorage(),
}: { storage?: SingleValueCacheStorage<T> } = {}): SingleValueCache<T> => ({
  cache: storage,
  suspend: (fn) => suspendOnPromise(fn, storage.get(), storage.set),
});
