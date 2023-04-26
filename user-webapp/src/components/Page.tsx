import { Navigation } from "_components/Navigation";
import { Message, useOfflineDetection } from "@ggbot2/design";
import Head from "next/head";
import { FC, PropsWithChildren, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export type PageProps = {
  metadata?: {
    /** HTML tag `title` content */
    title: string;
  };
  topbar?: ReactNode;
};

export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  metadata = { title: "ggbot2" },
  topbar = <Navigation />,
}) => {
  const { title } = metadata;

  const isOffline = useOfflineDetection();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <>
        {topbar}

        {isOffline ? <Message>
            <p>The network connection has been lost.</p>
          </Message> : null}

        {children}
      </>

      <Toaster position="top-right" />
    </>
  );
};
