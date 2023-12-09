import { CacheValue } from "./cache-ref";

// We wrap the `fn` in an async function to avoid
// throwing sync errors.
const callPromiseFn = async <T>(fn: () => Promise<T>) => await fn();

export const suspendOnPromise = <T>(
  fn: () => Promise<T>,
  cachedValue: CacheValue<T> | undefined | null,
  storeInCache: (value: CacheValue<T>) => void,
) => {
  if (!cachedValue) {
    const promise = callPromiseFn(fn).then(
      (value) => storeInCache({ status: "fulfilled", value }),
      (error) => storeInCache({ status: "rejected", error }),
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
