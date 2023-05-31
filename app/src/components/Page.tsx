import { Navigation } from "_components/Navigation";
import { Message, useOfflineDetection } from "@ggbot2/design";
import { FC, PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

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
          <p>The network connection has been lost.</p>
        </Message>
      ) : null}

      {children}

      <Toaster position="top-right" />
    </>
  );
};
