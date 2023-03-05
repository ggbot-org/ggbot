import { FC, PropsWithChildren } from "react";
import { classNames } from "../classNames";

export const Title: FC<PropsWithChildren> = ({ children }) => {
  return <p className={classNames("title", "is-4")}>{children}</p>;
};
