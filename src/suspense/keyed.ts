import { createKeyedCache } from "../cache/keyed";

export const createKeyedSuspense = <K extends string, T>(
  fn: (key: K) => Promise<T>
) => {
  const { storage, use } = createKeyedCache<K, T>();
  const useKeyedSuspense = (key: K) => use(key, () => fn(key));
  return { use: useKeyedSuspense, storage };
};
