import { KeyedCacheStorage, createKeyedSuspense } from "../suspense/keyed";

export const bindKeyedSuspense = <K, T>(
  fn: (key: K) => Promise<T>,
  { storage }: { storage?: KeyedCacheStorage<K, T> } = {}
) => {
  const { cache, suspend: cacheSuspend } = createKeyedSuspense<K, T>({
    storage,
  });
  const suspend = (key: K) => cacheSuspend(key, () => fn(key));
  return { suspend, cache };
};
