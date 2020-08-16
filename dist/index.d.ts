import React from "react";
declare type LoadingScreenComponentProps = {
    isLoaded: boolean;
};
export declare type LoadingScreenComponentType = React.ComponentType<LoadingScreenComponentProps>;
declare type LoadingScreenConfig = {
    limitMilliSecond?: number;
    debug?: boolean;
};
declare function withLoadingScreen<CP>(ChildrenComponent: React.ComponentType<CP>, LoadingScreenComponent: LoadingScreenComponentType, config?: LoadingScreenConfig): React.ComponentType<CP>;
export default withLoadingScreen;
