import { Message, useOfflineDetection } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { Navigation, NavigationProps } from "../components/Navigation.js";

export type PageProps = Pick<NavigationProps, "noMenu">;

export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  noMenu,
}) => {
  const isOffline = useOfflineDetection();

  return (
    <>
      <Navigation noMenu={isOffline ? true : noMenu} />

      {isOffline ? (
        <Message>
          <FormattedMessage id="Page.noNetwork" />
        </Message>
      ) : null}

      {children}
    </>
  );
};
