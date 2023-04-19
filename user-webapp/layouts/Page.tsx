import { FC, PropsWithChildren } from "react";
import { classNames } from "_classNames";
import { Navigation } from "_components/Navigation";
import { Page, PageProps } from "_components/Page";

type Props = PageProps;

export const PageLayout: FC<PropsWithChildren<Props>> = ({ children }) => (
    <Page topbar={<Navigation />}>
      <div className={classNames("p-1")}>{children}</div>
    </Page>
  );
