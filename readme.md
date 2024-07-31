# React Suspense utils

```sh
$ npm i -D @cprecioso/react-suspense       # if you use npm
$ yarn add --dev @cprecioso/react-suspense # if you use yarn
```

## API

_See the [docs](https://cprecioso.github.io/react-suspense/)_

## Quick-start

A simple way to do a `fetch` while suspending the tree

```tsx
import { bindKeyedSuspense } from "@cprecioso/react-suspense";

const { suspend: fetchPokemon } = bindKeyedSuspense((name: string) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => res.json()),
);

const Pokemon = ({ name }: { name: string }) => {
  const data = fetchPokemon(name);
  return (
    <li>
      {data.name} is {data.height * 10}cm tall
    </li>
  );
};

const App = () => {
  const names = ["pichu", "pikachu", "raichu"];

  return (
    <ul>
      {names.map((name) => (
        <Pokemon key={name} name={name} />
      ))}
    </ul>
  );
};

export default App;
```

You can wrap these components in `Suspense`s, handle data fetching errors in
your regular error boundaries, and use `useDeferredValue` and `startTransition`
to defer the loading to the background.

## Guide

This library returns some functions named `suspend`. `suspend()` can be called
from inside a component or a hook, and inside conditionals or loops, but not
from other kinds of functions such as `useEffect` or code outside of a React
tree.

The following functions are ordered from simple to more advanced:

### `bindSuspense`

```tsx
import { bindSuspense } from "@cprecioso/react-suspense";

const appConfig = bindSuspense(() =>
  fetch("/api/config").then((res) => res.json()),
);

export const Greeting = () => {
  const { accentColor } = appConfig.suspend();
  return <h1 style={{ color: accentColor }}>Hello world</h1>;
};
```

Pass it an async function, returns an object with:

- `suspend()`: call it to suspend your tree while the async function resolves.

- `cache`: an object that provides a `get`/`set` function to manually manipulate
  the cache. Useful to call `cache.set(null)` and force re-fetching.

### `bindKeyedSuspense`

```tsx
import { bindKeyedSuspense } from "@cprecioso/react-suspense";

const userInfo = bindKeyedSuspense((userId) =>
  fetch(`/api/user/${userId}`).then((res) => res.json()),
);

export const UserInfo = ({ userId }) => {
  const { name } = userInfo.suspend(userId);
  return <p>Name: {name}</p>;
};
```

Pass it an async function, returns an object with:

- `suspend(key)`: call it to suspend your tree while the async function
  resolves.

- `cache`: an object that provides a `get`/`set` function to manually manipulate
  the cache. Useful to call `cache.set(key, null)` and force re-fetching.

### `createSuspense`

### `createKeyedSuspense`

Same as their `bind` counterparts. However, the async function is not passed
when creating the cache, but when calling `suspend`: `suspend(fn)` /
`suspend(key, fn)`.

### Custom Storage

All functions also accept an object as their last parameter, with the option
`storage`. You can provide a backend for the cache, useful for using an LRU
cache ([`quick-lru`](https://github.com/sindresorhus/quick-lru)), avoiding
holding references to the obejcts (`WeakMap`), or accepting multiple objects as
the key ([`many-keys-map`](https://github.com/fregante/many-keys-map)).

The object must implement `get` and `set` methods like those of `Map`.
