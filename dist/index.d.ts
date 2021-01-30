import React from "react";
declare type LoadingProps = {
    isLoaded: boolean;
};
export declare type LoadingScreenComponentType = React.ComponentType<LoadingProps>;
declare type LoadingScreenConfig = {
    limitMilliSecond?: number;
    debug?: boolean;
};
declare function withLoadingScreen<CP extends {}>(ChildrenComponent: React.ComponentType<CP & Partial<LoadingProps>>, LoadingScreenComponent: LoadingScreenComponentType, config?: LoadingScreenConfig): React.ComponentType<CP>;
export default withLoadingScreen;
