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
exports.withLoadingScreen = void 0;
var react_1 = __importDefault(require("react"));
var useIsomorphicLayoutEffect = typeof window === "undefined" ? react_1.default.useEffect : react_1.default.useLayoutEffect;
var hasBeenLoaded = function () {
    if (typeof document === "undefined")
        return false;
    return document.readyState === "complete";
};
var preventEvent = function (event) { return event.preventDefault(); };
function withLoadingScreen(ChildrenComponent, LoadingScreenComponent, config) {
    var sendDebugMessage = function (message) {
        if (config === null || config === void 0 ? void 0 : config.debug)
            console.log(message);
    };
    (function () {
        sendDebugMessage("window: " + typeof window);
        if (typeof window == "undefined")
            return;
        // この時点で既に読み込みが完了している場合は load イベントの監視不要
        if (hasBeenLoaded())
            return;
        window.addEventListener("load", function () {
            var _a;
            sendDebugMessage('fired window "load" event!');
            (_a = document.querySelector("#loadingValidator")) === null || _a === void 0 ? void 0 : _a.click();
        });
        // ローディング画面表示中のスクロールを防ぐ
        // SP
        window.addEventListener("touchmove", preventEvent, { passive: false });
        // PC
        window.addEventListener("mousewheel", preventEvent, { passive: false });
        sendDebugMessage("added event listeners");
    })();
    return function (props) {
        sendDebugMessage("fired render");
        var _a = react_1.default.useState(false), isLoaded = _a[0], setIsLoaded = _a[1];
        var dismissLoadingScreen = react_1.default.useCallback(function () {
            sendDebugMessage("fired dismissLoadingScreen");
            window.removeEventListener("touchmove", preventEvent);
            window.removeEventListener("mousewheel", preventEvent);
            setIsLoaded(true);
        }, []);
        useIsomorphicLayoutEffect(function () {
            sendDebugMessage("fired useIsomorphicLayoutEffect");
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
exports.withLoadingScreen = withLoadingScreen;
