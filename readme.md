# React Suspense utils

```sh
$ npm i -D @cprecioso/react-suspense       # if you use npm
$ yarn add --dev @cprecioso/react-suspense # if you use yarn
```

## `use` functions

This library returns some functions named `use`. This is to keep consistency
with
[the proposed `use` function from React](https://github.com/reactjs/rfcs/pull/229).
Same as that proposal, `use` can be called from inside a component or a hook,
and inside conditionals or loops, but not from other kinds of functions such as
`useEffect` or code outside of a React tree.

## Suspenses

### `createSingleValueSuspense`

```jsx
import { createSingleValueSuspense } from "@cprecioso/react-suspense";

const { use: useAppConfig } = createSingleValueSuspense(async () =>
  (await fetch("/api/config")).json()
);

export const Greeting = () => {
  const { accentColor } = useAppConfig();
  return <h1 style={{ color: accentColor }}>Hello world</h1>;
};
```

Pass it an async function, returns an object with:

- `use()`: call it to suspend your tree while the async function resolves.

- `cache`: an object that provides a `get`/`set` function to manually manipulate
  the cache. Useful to call `cache.set(null)` and force re-fetching.

### `createKeyedSuspense`

```jsx
import { createKeyedSuspense } from "@cprecioso/react-suspense";

const { use: useUserInfo } = createKeyedSuspense(async (userId) =>
  (await fetch(`/api/user/${userId}`)).json()
);

export const UserInfo = ({ userId }) => {
  const { name } = useUserInfo(userId);
  return <p>Name: {name}</p>;
};
```

Pass it an async function, returns an object with:

- `use(key)`: call it to suspend your tree while the async function resolves.

- `cache`: an object that provides a `get`/`set` function to manually manipulate
  the cache. Useful to call `cache.set(key, null)` and force re-fetching.

## Caches

### `createSingleValueCache`

### `createKeyedCache`

Same as their `createXSuspense` counterparts, but the async function is not
passed when creating the cache, but when calling `use`: `use(fn)` /
`use(key, fn)`.

### `createSingleValueCacheWithStorage`

### `createKeyedCacheWithStorage`

Same as their `createXCache` counterparts, but you must provide an storage
object for the promise cache to be stored in. It's just an object with `get` and
`set` methods.
