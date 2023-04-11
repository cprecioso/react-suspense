import { CacheValue } from "./cache-ref";

export const suspendOnPromise = <T>(
  fn: () => Promise<T>,
  cachedValue: CacheValue<T> | null,
  storeInCache: (value: CacheValue<T>) => void
) => {
  if (!cachedValue) {
    const promise = fn().then(
      (value) => storeInCache({ status: "fulfilled", value }),
      (error) => storeInCache({ status: "rejected", error })
    );
    storeInCache({ status: "waiting", promise });
    throw promise;
  }

  switch (cachedValue.status) {
    case "waiting":
      throw cachedValue.promise;
    case "rejected":
      throw cachedValue.error;
    case "fulfilled":
      return cachedValue.value;
  }
};
