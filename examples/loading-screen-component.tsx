// An example of LoadingScreenComponent for Next.js

import React from "react";
import classnames from "classnames";
import { LoadingScreenComponentType } from "react-loading-screen-hoc";
import styles from "./styles.module.css";

export const LoadingScreenComponent: LoadingScreenComponentType = (props) => (
  <div
    className={classnames(styles.wrapper, {
      [styles.loaded]: props.isLoaded,
    })}
  >
    <span className={styles.blinking}>LOADING</span>
  </div>
);
