// An example _app.tsx of Next.js

import React from "react";
import type { AppProps } from "next/app";
import withLoadingScreen from "react-loading-screen-hoc";
import { LoadingScreenComponent } from "path/to/loading-screen.component";

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withLoadingScreen(CustomApp, LoadingScreenComponent, {
  limitMilliSecond: 10 * 1000,
  debug: true,
});
