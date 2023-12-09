import { StoredCacheValue } from "./lib/cache-ref";
import { suspendOnPromise } from "./lib/suspend";

const cache = new WeakMap<Promise<any>, StoredCacheValue<any>>();

export const suspend = <T>(promise: Promise<T>): T =>
  suspendOnPromise(
    () => promise,
    cache.get(promise),
    cache.set.bind(cache, promise),
  );
