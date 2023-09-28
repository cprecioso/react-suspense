import {
  SingleValueCacheStorage,
  createSuspense,
} from "../suspense/single-value";

/**
 * Create a suspending function that will cache the result of the function call.
 * This function will be called only once, with no arguments, and the result will be cached.
 *
 * @param fetcher
 * @param options
 *
 * @example
 * import { bindSuspense } from "@cprecioso/react-suspense";
 *
 * const appConfig = bindSuspense(() =>
 *   fetch("/api/config").then((res) => res.json())
 * );
 *
 * export const Greeting = () => {
 *   const { accentColor } = appConfig.suspend();
 *   return <h1 style={{ color: accentColor }}>Hello world</h1>;
 * };
 */
export const bindSuspense = <Value>(
  /**
   * The async function that will be called when suspending.
   *
   * If need to respond to different arguments, you can use {@link bindKeyedSuspense} instead.
   */
  fetcher: () => Promise<Value>,
  {
    storage,
  }: {
    /**
     * **(Advanced)** You can provide the backing cache object
     *
     * By default it uses an internal implementation based on
     * a simple variable, but you can provide your own implementation
     */
    storage?: SingleValueCacheStorage<Value>;
  } = {}
): {
  /** Suspend your tree while the async function resolves, and return its promise's value */
  suspend: () => Value;
  /**
   * Access to the backing cache.
   *
   * @remark
   * Useful for doing `cache.set(null)`, and force a re-fetch.
   */
  cache: SingleValueCacheStorage<Value>;
} => {
  const { cache, suspend: cacheSuspend } = createSuspense<Value>({
    storage,
  });
  const suspend = () => cacheSuspend(fetcher);
  return { suspend, cache };
};
