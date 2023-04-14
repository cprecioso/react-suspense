import { createKeyedCache } from "../cache/keyed";

export const createKeyedSuspense = <K extends string, T>(
  fn: (key: K) => Promise<T>
) => {
  const cache = createKeyedCache<K, T>();

  const useKeyedSuspense = (key: K) => {
    const value = cache.use(key, () => fn(key));
    return { value, cache };
  };

  return useKeyedSuspense;
};
