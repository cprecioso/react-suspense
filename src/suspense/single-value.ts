import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

/** A backing cache for a single-value suspense. Provide `get` and `set` functions. */
export interface SingleValueCacheStorage<Value> {
  get(): CacheValue<Value> | undefined | null;
  set(value: CacheValue<Value> | null): void;
}

class DefaultSingleValueStorage<Value>
  implements SingleValueCacheStorage<Value>
{
  #storage?: CacheValue<Value> | null;

  get() {
    return this.#storage;
  }

  set(value: CacheValue<Value> | null) {
    this.#storage = value;
  }
}

/**
 * Create a suspense cache for a single value.
 *
 * @param options
 */
export const createSuspense = <Value>({
  storage = new DefaultSingleValueStorage(),
}: {
  /**
   * **(Advanced)** You can provide the backing cache object
   *
   * By default it uses an internal implementation based on
   * an internal variable, but you can provide your own implementation
   */
  storage?: SingleValueCacheStorage<Value>;
} = {}): {
  /**
   * Access to the backing cache.
   *
   * @remark
   * Useful for doing `cache.set(null)`, and force a re-fetch.
   */
  cache: SingleValueCacheStorage<Value>;
  /**
   * Suspend your tree while the async function resolves, and return its promise's value
   *
   * @remark
   * **This will not call the function again if it changes!**
   * If you need to respond to different arguments, you can use {@link createKeyedSuspense} instead.
   */
  suspend: (fn: () => Promise<Value>) => Value;
} => ({
  cache: storage,
  suspend: (fn) => suspendOnPromise(fn, storage.get(), storage.set),
});
