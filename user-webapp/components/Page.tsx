import { Message, useOfflineDetection } from "@ggbot2/design";
import Head from "next/head";
import React, { FC, PropsWithChildren, ReactNode, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { webappBaseUrl } from "_routing";

export type PageProps = {
  metadata?: {
    /** Tag title content */
    title: string;
    /** Link rel canonical pathname, e.g. `/settings`. */
    canonical?: string;
  };
  topbar?: ReactNode;
};

export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  metadata = { title: "ggbot2" },
  topbar,
}) => {
  const { title, canonical } = metadata;

  const isOffline = useOfflineDetection();

  const canonicalHref = useMemo(
    () => `${webappBaseUrl}${canonical ?? "/"}`,
    [canonical]
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={canonicalHref} />
      </Head>

      <>
        {topbar}

        {isOffline && (
          <Message>
            <p>The network connection has been lost.</p>
          </Message>
        )}

        {children}
      </>

      <Toaster position="top-right" />
    </>
  );
};
