import { StoredCacheValue } from "./lib/cache-ref";
import { suspendOnPromise } from "./lib/suspend";

const cache = new WeakMap<Promise<any>, StoredCacheValue<any>>();

/**
 * @hidden
 *
 * **Experimental** This is a function that can suspend on any promise,
 * without creating a cache first (it uses a WeakMap). Users beware,
 * it needs testing on whether it creates reference cycles, or whether
 * it works at all. This is hidden from the documentation for a reason.
 *
 * This is undocumented and thus breaking changes might happen in
 * between minor releases.
 */
export const experimentalSuspend = <T>(promise: Promise<T>): T =>
  suspendOnPromise(
    () => promise,
    cache.get(promise),
    cache.set.bind(cache, promise),
  );
