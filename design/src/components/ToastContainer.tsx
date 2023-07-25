import { FC, PropsWithChildren } from "react";

import { _classNames } from "../components/_classNames.js";

export type ToastContainerClassNames = "ToastContainer";

export const ToastContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={_classNames("ToastContainer")}>{children}</div>
);
