import { FC, PropsWithChildren } from "react";

import { Page, PageProps } from "../components/Page.js";
import { classNames } from "../styles/classNames.js";

type Props = PageProps;

export const PageLayout: FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => (
  <Page {...props}>
    <div className={classNames("p-1")}>{children}</div>
  </Page>
);
