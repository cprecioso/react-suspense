import {
  SingleValueCacheStorage,
  createSuspense,
} from "../suspense/single-value";

export const bindSuspense = <T>(
  fn: () => Promise<T>,
  { storage }: { storage?: SingleValueCacheStorage<T> } = {}
) => {
  const { cache, suspend: cacheSuspend } = createSuspense<T>({
    storage,
  });
  const suspend = () => cacheSuspend(fn);
  return { suspend, cache };
};
