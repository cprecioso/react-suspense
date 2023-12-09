import { StoredCacheValue } from "../lib/cache-ref";
import { KeyedCacheStorage, createKeyedSuspense } from "../suspense/keyed";

/**
 * Create a suspending function that will cache the result of the function call.
 * This function will be called only once, with the key as its arguments, and the result will be cached for that key.
 *
 * @remark
 * The key can be any type, as it is passed directly to `Map` (by default).
 * It can be a good idea to customize your `storage` to avoid memory leaks (with `WeakMap`) if your keys are always objects,
 * or to allow for more complex cache invalidation logic (e.g. with [`quick-lru`](https://github.com/sindresorhus/quick-lru)).
 *
 * If you need multiple objects as your key (e.g. `{ userId, postId }`), you can use `JSON.stringify` to convert it to a string,
 * or pass them as an array and use a [`many-keys-map`](https://github.com/fregante/many-keys-map) as your `storage`.
 *
 * @param fetcher
 * @param options
 *
 * @example
 * import { bindKeyedSuspense } from "@cprecioso/react-suspense";
 *
 * const userData = bindKeyedSuspense((userId) =>
 *   fetch(`/api/user/${userId}`).then((res) => res.json())
 * );
 *
 * export const UserInfo = ({ userId }) => {
 *   const { name } = userData.suspend(userId);
 *   return <p>Name: {name}</p>;
 * };
 *
 * @example
 * import { bindKeyedSuspense } from "@cprecioso/react-suspense";
 * import ManyKeysMap from "many-keys-map";
 *
 * const postData = bindKeyedSuspense(
 *   ([userId, postId]) =>
 *     fetch(`/api/post/${userId}/${postId}`).then((res) => res.json()),
 *   { storage: new ManyKeysMap() }
 * );
 *
 * export const PostInfo = ({ userId, postId }) => {
 *   const {
 *     title,
 *     author: { name },
 *   } = postData.suspend([userId, postId]);
 *   return (
 *     <p>
 *       {title}, by {name}
 *     </p>
 *   );
 * };
 */
export const bindKeyedSuspense = <
  Key,
  Value,
  Storage extends KeyedCacheStorage<
    Key,
    StoredCacheValue<Value>
  > = KeyedCacheStorage<Key, StoredCacheValue<Value>>,
>(
  /**
   * The async function that will be called when suspending. It will accept the `key` parameter.
   *
   * If you don't need a `key`, you can use {@link bindSuspense} instead.
   */
  fetcher: (
    /** The cache key */
    key: Key,
  ) => Promise<Value>,
  {
    storage,
  }: {
    /** **(Advanced)** You can provide the backing cache object */
    storage?: Storage;
  } = {},
): {
  /** Suspend your tree while the async function resolves, it takes a `key`, and return its promise's value */
  suspend: (key: Key) => Value;
  /**
   * Access to the backing cache.
   *
   * @remark
   * Useful for doing `cache.set(key, null)`, and force a re-fetch.
   */
  cache: KeyedCacheStorage<Key, Value>;
} => {
  const { cache, suspend: cacheSuspend } = createKeyedSuspense<Key, Value>({
    storage,
  });
  const suspend = (key: Key) => cacheSuspend(key, () => fetcher(key));
  return { suspend, cache: cache as any };
};
