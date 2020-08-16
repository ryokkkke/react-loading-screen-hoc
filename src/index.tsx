import React from "react";

type LoadingScreenComponentProps = { isLoaded: boolean };
type LoadingScreenComponentType = React.ComponentType<LoadingScreenComponentProps>;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const hasBeenLoaded = () => {
  if (typeof document === "undefined") return false;

  return document.readyState === "complete";
};
const preventEvent = (event: Event) => event.preventDefault();

export function withLoadingScreen<CP>(
  ChildrenComponent: React.ComponentType<CP>,
  LoadingScreenComponent: LoadingScreenComponentType,
  config?: { limitMilliSecond?: number; debug?: boolean }
): React.ComponentType<CP> {
  const sendDebugMessage = (message: string) => {
    if (config?.debug) console.log(message);
  };

  (() => {
    sendDebugMessage(`window: ${typeof window}`);

    if (typeof window == "undefined") return;

    // この時点で既に読み込みが完了している場合は load イベントの監視不要
    if (hasBeenLoaded()) return;

    window.addEventListener("load", () => {
      sendDebugMessage('fired window "load" event!');
      (document.querySelector("#loadingValidator") as HTMLDivElement)?.click();
    });

    // ローディング画面表示中のスクロールを防ぐ
    // SP
    window.addEventListener("touchmove", preventEvent, { passive: false });
    // PC
    window.addEventListener("mousewheel", preventEvent, { passive: false });

    sendDebugMessage("added event listeners");
  })();

  return (props: CP) => {
    sendDebugMessage("fired render");

    const [isLoaded, setIsLoaded] = React.useState(false);

    const dismissLoadingScreen = React.useCallback(() => {
      sendDebugMessage("fired dismissLoadingScreen");

      window.removeEventListener("touchmove", preventEvent);
      window.removeEventListener("mousewheel", preventEvent);

      setIsLoaded(true);
    }, []);

    useIsomorphicLayoutEffect(() => {
      sendDebugMessage("fired useIsomorphicLayoutEffect");

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
