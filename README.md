# React Loading Screen HOC

[![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://npmjs.org/package/live-xxx

An HOC function `withLoadingScreen` that makes any components to display as a page loading screen.
In Next.js, the hoc function is assumed to be passed a component that will be exported in `_app.tsx`.
Necessary types are included by default for TypeScript.

## Install

```bash
npm i -S react-loading-screen-hoc
```

## Usage

```
function withLoadingScreen<CP>(
  // a component that will be wrapped.
  ChildrenComponent: React.ComponentType<CP>,

  // a component thet will be displayed as a loading screen.
  LoadingScreenComponent: LoadingScreenComponentType,

  // configurations
  config?: LoadingScreenConfig

): React.ComponentType<CP>;
```

See `dist/index.d.ts` for full declarations.

### Example

```index.tsx
import withLoadingScreen from "react-loading-screen-hoc";

const LoadingScreenComponent = (props: { isLoaded: boolean }) => {
  const className = props.isLoaded ? "loaded" : "";

  return <div className={className}> ~~~ </div>;
};

const MainComponent = () => {
  /* ~~~ */
};

export default withLoadingScreen(MainComponent, LoadingScreenComponent, {
  /* config if needed */
});
```

That's it!

- `withLoadingScreen` displays `LoadingScreenComponent` until finishing to load page.
- uses `document.readyState` and `window.addEventListener("load", ~~~)` to validate whether a page finishes loading.
- prevents to scroll while displaying `LoadingScreenComponent`.
- `LoadingScreenComponent` has only one constraint of props that needs to have `isLoaded` property.

### Example for Next.js

```_app.tsx
import React from "react";
import type { AppProps } from "next/app";
import withLoadingScreen from "next-loading-screen";
import { LoadingScreenComponent } from "path/to/loading-screen-component.tsx";

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withLoadingScreen(CustomApp, LoadingScreenComponent, {
  limitMilliSecond: 10 * 1000,
});
```

## License

[MIT](http://vjpr.mit-license.org)