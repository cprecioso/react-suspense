# React Suspense utils

```sh
$ npm i -D @cprecioso/react-suspense       # if you use npm
$ yarn add --dev @cprecioso/react-suspense # if you use yarn
```

## `createSingleValueSuspense`

```ts
const createSingleValueSuspense: <T>(
  getClientValue: () => Promise<T>,
  getServerValue?: () => Promise<T>
) => () => T;
```

Creates a hook to get a single value, suspending the tree. It only works on the
client unless manually specified.

> The `getServerValue` argument has the same restrictions as the second argument
> for
> [the `useSyncExternalStore` hook](https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering),
> especially the requirement of it returning the same value on client and
> server.

### Example

#### Only client-side

```tsx
import { createSingleValueSuspense } from "@cprecioso/react-suspense";

const useAppConfig = createSingleValueSuspense(
  // A `Promise`-returning function with the value you want to pass to your application
  async () => (await fetch("/api/config")).json()
);

export const MyComponent = () => {
  const { accentColor } = useAppConfig();

  return (
    <div style={{ backgroundColor: accentColor }}>
      <h1>Hello world!</h1>
    </div>
  );
};
```

#### Client- and server-side

```tsx
import { createSingleValueSuspense } from "@cprecioso/react-suspense";

const useAppConfig = createSingleValueSuspense(
  async () => (await fetch("/api/config")).json(),
  // For example, here we use a dummy value for the inital server-side rendering,
  // but we could do anything, like calling another API.
  async () => ({ accentColor: "black" })
);

export const MyComponent = () => {
  const { accentColor } = useAppConfig();

  return (
    <div style={{ backgroundColor: accentColor }}>
      <h1>Hello world!</h1>
    </div>
  );
};
```
