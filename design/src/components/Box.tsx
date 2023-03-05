import { FC, PropsWithChildren } from "react";
import { classNames } from "../classNames";

export type BoxProps = {
  title?: string;
};

export const Box: FC<PropsWithChildren<BoxProps>> = ({ children, title }) => {
  return (
    <div className={classNames("box")}>
      {title && <p className={classNames("title", "is-4")}>{title}</p>}
      {children}
    </div>
  );
};
