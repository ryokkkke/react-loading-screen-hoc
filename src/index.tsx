import React from "react";

type LoadingScreenComponentProps = { isLoaded: boolean };
export type LoadingScreenComponentType = React.ComponentType<LoadingScreenComponentProps>;
type LoadingScreenConfig = { limitMilliSecond?: number; debug?: boolean };

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const hasBeenLoaded = () => {
  if (typeof document === "undefined") return false;

  return document.readyState === "complete";
};
const preventEvent = (event: Event) => event.preventDefault();

function withLoadingScreen<CP>(
  ChildrenComponent: React.ComponentType<CP>,
  LoadingScreenComponent: LoadingScreenComponentType,
  config?: LoadingScreenConfig
): React.ComponentType<CP> {
  const sendDebugMessage = (message: string) => {
    if (config?.debug) console.log(`react-loading-screen-hoc: ${message}`);
  };

  (() => {
    sendDebugMessage(`window: ${typeof window}`);

    if (typeof window == "undefined") return;

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

    sendDebugMessage("added event listeners");
  })();

  return (props: CP) => {
    sendDebugMessage("fired render of wrapper component");

    const [isLoaded, setIsLoaded] = React.useState(false);

    const dismissLoadingScreen = React.useCallback(() => {
      sendDebugMessage("fired dismissLoadingScreen");

      window.removeEventListener("touchmove", preventEvent);
      window.removeEventListener("wheel", preventEvent);

      setIsLoaded(true);
    }, []);

    useIsomorphicLayoutEffect(() => {
      sendDebugMessage("fired useLayoutEffect");

      // 既にロードが完了している場合は dismiss する
      if (!isLoaded && hasBeenLoaded()) return dismissLoadingScreen();

      if (config?.limitMilliSecond == undefined) return;
      if (hasBeenLoaded()) return;

      // 最悪 ${config.limit}ms でローディング画面を消す
      const timer = setTimeout(() => {
        sendDebugMessage(`elapsed ${config.limitMilliSecond} ms`);
        dismissLoadingScreen();
      }, config.limitMilliSecond);
      sendDebugMessage("set setTimeout: dismissLoadingScreen");

      return () => clearTimeout(timer);
    }, [isLoaded, dismissLoadingScreen]);

    return (
      <>
        <div style={{ position: "relative", "zIndex": 5 }}>
          <div id="loadingValidator" onClick={dismissLoadingScreen} />
          <LoadingScreenComponent isLoaded={isLoaded} />
        </div>

        <div style={{ position: "relative", "zIndex": 1 }}>
          <ChildrenComponent {...props} />
        </div>
      </>
    );
  };
}

export default withLoadingScreen;
