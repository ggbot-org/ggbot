import { Page, Navigation } from "_components";
import { FC, PropsWithChildren } from "react";

// TODO move components/Page here
export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return <Page topbar={<Navigation />}>{children}</Page>;
};
