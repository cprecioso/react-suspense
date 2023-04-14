import { createSingleValueCache } from "../cache/single-value";

export const createSingleValueSuspense = <T>(fn: () => Promise<T>) => {
  const cache = createSingleValueCache<T>();

  const useSingleValueSuspense = () => {
    const value = cache.use(fn);
    return { value, cache };
  };

  return useSingleValueSuspense;
};
