import { Message, useOfflineDetection } from "@ggbot2/design";
import Head from "next/head";
import React, { FC, PropsWithChildren, ReactNode, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { webappBaseUrl } from "_routing";

type Props = {
  metadata?: {
    /** Tag title content */
    title: string;
    /** Meta description */
    description: string;
    /** Link rel canonical pathname, e.g. `/settings`. */
    canonical?: string;
  };
  topbar?: ReactNode;
};

export const Page: FC<PropsWithChildren<Props>> = ({
  children,
  metadata = { title: "ggbot2", description: "crypto flow" },
  topbar,
}) => {
  const { title, description, canonical } = metadata;

  const isOffline = useOfflineDetection();

  const canonicalHref = useMemo(() => `${webappBaseUrl}${canonical ?? "/"}`, [canonical]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
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
