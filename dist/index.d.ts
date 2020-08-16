import React from "react";
declare type LoadingScreenComponentProps = {
    isLoaded: boolean;
};
declare type LoadingScreenComponentType = React.ComponentType<LoadingScreenComponentProps>;
export declare function withLoadingScreen<CP>(ChildrenComponent: React.ComponentType<CP>, LoadingScreenComponent: LoadingScreenComponentType, config?: {
    limitMilliSecond?: number;
    debug?: boolean;
}): React.ComponentType<CP>;
export {};
