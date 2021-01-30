import React from "react";

type LoadingProps = { isLoaded: boolean };
export type LoadingScreenComponentType = React.ComponentType<LoadingProps>;
type LoadingScreenConfig = { limitMilliSecond?: number; debug?: boolean };

const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
const hasBeenLoaded = () => {
  if (!isBrowser) return false;

  return document.readyState === "complete";
};
const preventEvent = (event: Event) => event.preventDefault();
const preventScrolling = () => isBrowser && window.scrollTo(window.pageXOffset, window.pageYOffset);
const userAgent = isBrowser ? window.navigator.userAgent.toLowerCase() : undefined;
const isIe = () => {
  if (userAgent == undefined) return false;

  return userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1;
};
const isEdge = () => {
  if (userAgent == undefined) return false;

  return userAgent.indexOf("edg") != -1;
};
const isIeOrEdge = () => isIe() || isEdge();

function withLoadingScreen<CP extends {}>(
  ChildrenComponent: React.ComponentType<CP & Partial<LoadingProps>>,
  LoadingScreenComponent: LoadingScreenComponentType,
  config?: LoadingScreenConfig
): React.ComponentType<CP> {
  const sendDebugMessage = (message: string) => {
    if (config?.debug) console.log(`react-loading-screen-hoc: ${message}`);
  };

  (() => {
    sendDebugMessage(`window: ${typeof window}`);

    if (!isBrowser) return;

    // if loading has already been completed at this point, it is not necessary to monitor the "load" event
    if (hasBeenLoaded()) return;

    window.addEventListener("load", () => {
      sendDebugMessage('window "load" event has been fired!');
      (document.querySelector("#loadingValidator") as HTMLDivElement)?.click();
    });

    // prevent scrolling while the loading screen is displayed
    // SP
    window.addEventListener("touchmove", preventEvent, { passive: false });
    // PC
    window.addEventListener("wheel", preventEvent, { passive: false });
    // This is not an accurate solution, but "wheel" event is not fired when wheel by a trackpad on IE11 and Edge :(
    if (isIeOrEdge()) window.addEventListener("scroll", preventScrolling, { passive: false });

    sendDebugMessage("added event listeners");
  })();

  return (props: CP) => {
    sendDebugMessage("fired render of wrapper component");

    const [isLoaded, setIsLoaded] = React.useState(false);

    const dismissLoadingScreen = React.useCallback(() => {
      sendDebugMessage("fired dismissLoadingScreen");

      // true is necessary for the third argument to remove a `{ passive: false }` event listener on IE11,
      // and false is necessary on other Browsers.
      window.removeEventListener("touchmove", preventEvent, isIe());
      window.removeEventListener("wheel", preventEvent, isIe());
      if (isIeOrEdge()) window.removeEventListener("scroll", preventScrolling, isIe());

      setIsLoaded(true);
    }, []);

    useIsomorphicLayoutEffect(() => {
      sendDebugMessage("fired useLayoutEffect");

      // dismiss a loading screen when already finished loading
      if (!isLoaded && hasBeenLoaded()) return dismissLoadingScreen();

      if (config?.limitMilliSecond == undefined) return;
      if (hasBeenLoaded()) return;

      // dismiss a loading screen at least after ${config.limit} ms
      const timer = setTimeout(() => {
        sendDebugMessage(`elapsed ${config.limitMilliSecond} ms`);
        dismissLoadingScreen();
      }, config.limitMilliSecond);
      sendDebugMessage("set setTimeout: dismissLoadingScreen");

      return () => clearTimeout(timer);
    }, [isLoaded, dismissLoadingScreen]);

    return (
      <>
        <div
          className="reactLoadingScreenHoc-loadingScreenWrapper"
          style={{ position: "relative", "zIndex": 5 }}
        >
          <div id="loadingValidator" onClick={dismissLoadingScreen} />
          <LoadingScreenComponent isLoaded={isLoaded} />
        </div>

        <div
          className="reactLoadingScreenHoc-mainContentsWrapper"
          style={{ position: "relative", "zIndex": 1 }}
        >
          <ChildrenComponent {...props} isLoaded={isLoaded} />
        </div>
      </>
    );
  };
}

export default withLoadingScreen;
