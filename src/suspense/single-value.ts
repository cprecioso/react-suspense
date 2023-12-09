import { StoredCacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

/** A backing cache for a single-value suspense. Provide `get` and `set` functions. */
export interface SingleValueCacheStorage<Value> {
  get(): Value | undefined;
  set(value: Value): void;
}

class DefaultSingleValueStorage<Value>
  implements SingleValueCacheStorage<Value>
{
  #storage?: Value;

  get() {
    return this.#storage;
  }

  set(value: Value) {
    this.#storage = value;
  }
}

/**
 * Create a suspense cache for a single value.
 *
 * @param options
 */
export const createSuspense = <
  Value,
  Storage extends SingleValueCacheStorage<
    StoredCacheValue<Value>
  > = SingleValueCacheStorage<StoredCacheValue<Value>>,
>({
  storage = new DefaultSingleValueStorage() as any,
}: {
  /**
   * **(Advanced)** You can provide the backing cache object
   *
   * By default it uses an internal implementation based on
   * an internal variable, but you can provide your own implementation
   */
  storage?: Storage;
} = {}): {
  /**
   * Access to the backing cache.
   *
   * @remark
   * Useful for doing `cache.set(null)`, and force a re-fetch.
   */
  cache: Storage;
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
  suspend: (fn) =>
    suspendOnPromise(fn, storage.get(), storage.set.bind(storage)),
});
