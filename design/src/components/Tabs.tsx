import { FC, PropsWithChildren } from "react";
import { Tabs as _Tabs } from "trunx";

export const Tabs: FC<PropsWithChildren> = ({ children }) => {
  return <_Tabs isBoxed>{children}</_Tabs>;
};