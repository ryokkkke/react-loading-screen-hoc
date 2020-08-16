# React Loading Screen HOC

[![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/react-loading-screen-hoc
[npm-url]: https://www.npmjs.com/package/react-loading-screen-hoc

React（Next.js を想定）でページのローディング画面を簡単に実装する HOC `withLoadingScreen`。
Next.js では`_app.tsx`で `export` する際に噛ませる想定。
型定義ファイルも含む。

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

完全な型定義は `dist/index.d.ts` をご覧ください。

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

これだけで、以下の機能を提供。

- `LoadingScreenComponent` をページのロードが完了するまで表示します。
- ページのロードの判別については `document.readyState` と `window.addEventListener("load", ~~~)` を使用してます。
- ロード完了するまで SP、PC ともにスクロールを防ぎます。
- `LoadingScreenComponent` として渡すコンポーネントは、 `isLoaded` （ロード完了したら`true`になる）というプロパティを持った props を受け取ることができる必要があります。
  - `LoadingScreenComponent` の表示/非表示はこの `isLoaded` を元に実装してください。

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
