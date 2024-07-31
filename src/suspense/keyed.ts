import type { StoredCacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

/**
 * A backing cache for a keyed suspense. Provide `get` and `set` functions.
 *
 * Usefully, the built-in `Map` and `WeakMap` already implement this interface. Plenty
 * of other libraries do too, like [`many-keys-map`](https://github.com/fregante/many-keys-map),
 * and [`quick-lru`](https://github.com/sindresorhus/quick-lru).
 */
export interface KeyedCacheStorage<Key, Value> {
  get(key: Key): Value | undefined;
  set(key: Key, value: Value): void;
}

/**
 * Create a keyed suspense cache.
 *
 * @param options
 */
export const createKeyedSuspense = <
  Key,
  Value,
  Storage extends KeyedCacheStorage<
    Key,
    StoredCacheValue<Value>
  > = KeyedCacheStorage<Key, StoredCacheValue<Value>>,
>({
  /** **(Advanced)** You can provide the backing cache object */
  storage = new Map() as unknown as Storage,
} = {}) => ({
  /**
   * Access to the backing cache.
   *
   * @remark
   * Useful for doing `cache.set(key, null)`, and force a re-fetch.
   */
  cache: storage,

  /**
   * Suspend your tree while the async function resolves, it takes a `key`, and return its promise's value.
   *
   * @remark
   * **This will not call the function again if it changes, only when the key changes!**
   * If you don't need to respond to different keys, you can use {@link createSuspense} instead.
   */
  suspend: (key: Key, fn: () => Promise<Value>) =>
    suspendOnPromise(fn, storage.get(key), storage.set.bind(storage, key)),
});
