import { CacheValue } from "../lib/cache-ref";
import { suspendOnPromise } from "../lib/suspend";

export const createSingleValueCache = <T>() => {
  const storage = {
    current: null as CacheValue<T> | null,
  };

  const use = (fn: () => Promise<T>) =>
    suspendOnPromise(fn, storage.current, (value) => {
      storage.current = value;
    });

  return { use, storage };
};
