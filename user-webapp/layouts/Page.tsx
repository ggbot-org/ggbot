import { FC, PropsWithChildren } from "react";
import { classNames } from "_classNames";
import { Page, PageProps } from "_components/Page";

type Props = PageProps;

export const PageLayout: FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => (
  <Page {...props}>
    <div className={classNames("p-1")}>{children}</div>
  </Page>
);
