import { FC, PropsWithChildren } from "react";
import { classNames } from "_classNames";
import { Navigation, Page, PageProps } from "_components";

type Props = PageProps;

export const PageLayout: FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <Page topbar={<Navigation />}>
      <div className={classNames("p-1")}>{children}</div>
    </Page>
  );
};
