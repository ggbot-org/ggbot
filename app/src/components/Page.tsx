import { Message, useOfflineDetection } from "@ggbot2/design";
import { FC, PropsWithChildren, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { Navigation } from "../components/Navigation.js";

export type PageProps = {
  topbar?: ReactNode;
};

export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  topbar = <Navigation />,
}) => {
  const isOffline = useOfflineDetection();

  return (
    <>
      {topbar}

      {isOffline ? (
        <Message>
          <FormattedMessage id="Page.noNetwork" />
        </Message>
      ) : null}

      {children}
    </>
  );
};
