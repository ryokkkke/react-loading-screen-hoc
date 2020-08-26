"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var useIsomorphicLayoutEffect = typeof window === "undefined" ? react_1.default.useEffect : react_1.default.useLayoutEffect;
var hasBeenLoaded = function () {
    if (typeof document === "undefined")
        return false;
    return document.readyState === "complete";
};
var preventEvent = function (event) { return event.preventDefault(); };
var preventScrolling = function () { return window && window.scrollTo(window.pageXOffset, window.pageYOffset); };
var isIeOrEdge = function () {
    if (window == undefined)
        return false;
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1 || ua.indexOf("edg") != -1;
};
function withLoadingScreen(ChildrenComponent, LoadingScreenComponent, config) {
    var sendDebugMessage = function (message) {
        if (config === null || config === void 0 ? void 0 : config.debug)
            console.log("react-loading-screen-hoc: " + message);
    };
    (function () {
        sendDebugMessage("window: " + typeof window);
        if (typeof window == "undefined")
            return;
        // if loading has already been completed at this point, it is not necessary to monitor the "load" event
        if (hasBeenLoaded())
            return;
        window.addEventListener("load", function () {
            var _a;
            sendDebugMessage('window "load" event has been fired!');
            (_a = document.querySelector("#loadingValidator")) === null || _a === void 0 ? void 0 : _a.click();
        });
        // prevent scrolling while the loading screen is displayed
        // SP
        window.addEventListener("touchmove", preventEvent, { passive: false });
        // PC
        window.addEventListener("wheel", preventEvent, { passive: false });
        // This is not an accurate solution, but "wheel" event is not fired when wheel by a trackpad on IE11 and Edge :(
        if (isIeOrEdge())
            window.addEventListener("scroll", preventScrolling, { passive: false });
        sendDebugMessage("added event listeners");
    })();
    return function (props) {
        sendDebugMessage("fired render of wrapper component");
        var _a = react_1.default.useState(false), isLoaded = _a[0], setIsLoaded = _a[1];
        var dismissLoadingScreen = react_1.default.useCallback(function () {
            sendDebugMessage("fired dismissLoadingScreen");
            window.removeEventListener("touchmove", preventEvent, true);
            window.removeEventListener("wheel", preventEvent, true);
            if (isIeOrEdge())
                window.removeEventListener("scroll", preventScrolling, true);
            setIsLoaded(true);
        }, []);
        useIsomorphicLayoutEffect(function () {
            sendDebugMessage("fired useLayoutEffect");
            // 既にロードが完了している場合は dismiss する
            if (!isLoaded && hasBeenLoaded())
                return dismissLoadingScreen();
            if ((config === null || config === void 0 ? void 0 : config.limitMilliSecond) == undefined)
                return;
            if (hasBeenLoaded())
                return;
            // 最悪 ${config.limit}ms でローディング画面を消す
            var timer = setTimeout(function () {
                sendDebugMessage("elapsed " + config.limitMilliSecond + " ms");
                dismissLoadingScreen();
            }, config.limitMilliSecond);
            sendDebugMessage("set setTimeout: dismissLoadingScreen");
            return function () { return clearTimeout(timer); };
        }, [isLoaded, dismissLoadingScreen]);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { style: { position: "relative", "zIndex": 5 } },
                react_1.default.createElement("div", { id: "loadingValidator", onClick: dismissLoadingScreen }),
                react_1.default.createElement(LoadingScreenComponent, { isLoaded: isLoaded })),
            react_1.default.createElement("div", { style: { position: "relative", "zIndex": 1 } },
                react_1.default.createElement(ChildrenComponent, __assign({}, props)))));
    };
}
exports.default = withLoadingScreen;
