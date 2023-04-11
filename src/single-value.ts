import { useSyncExternalStore } from "react";
import { CacheValue } from "./cache-ref";
import { suspendOnPromise } from "./suspend";

const subscribe = (cb: () => void) => {
  cb();
  return () => {};
};

const makeGetSnapshot = <T>(getValue: () => Promise<T>) => {
  let value: CacheValue<T> | null;

  const getSnapshot = () =>
    suspendOnPromise(getValue, value, (newValue) => {
      value = newValue;
    });

  return getSnapshot;
};

export const createSingleValueSuspense = <T>(
  getClientValue: () => Promise<T>,
  getServerValue?: () => Promise<T>
) => {
  const getClientSnapshot = makeGetSnapshot(getClientValue);
  const getServerSnapshot = getServerValue && makeGetSnapshot(getServerValue);

  const useSingleValueSuspense = () =>
    useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return useSingleValueSuspense;
};
