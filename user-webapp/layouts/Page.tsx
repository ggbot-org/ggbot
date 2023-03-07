import { Page, Navigation } from "_components";
import { FC, PropsWithChildren } from "react";

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return <Page topbar={<Navigation />}>{children}</Page>;
};
