import { createSingleValueCache } from "../cache/single-value";

export const createSingleValueSuspense = <T>(fn: () => Promise<T>) => {
  const { storage, use } = createSingleValueCache<T>();
  const useSingleValueSuspense = () => use(fn);
  return { use: useSingleValueSuspense, storage };
};
