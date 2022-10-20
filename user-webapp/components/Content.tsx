import Head from "next/head";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { webappBaseUrl } from "_routing";

type Props = {
  children: ReactNode;
  metadata?: {
    /** Tag title content */
    title: string;
    /** Meta description */
    description: string;
    /** Link rel canonical pathname, e.g. `/settings`. */
    canonical?: string;
  };
  topbar?: ReactNode;
  message?: ReactNode;
};

export const Content: FC<Props> = ({
  children,
  metadata = { title: "ggbot2", description: "crypto flow" },
  message,
  topbar,
}) => {
  const { title, description, canonical } = metadata;

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const onOffline = () => {
      setIsOffline(true);
    };
    const onOnline = () => {
      setIsOffline(false);
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  const canonicalHref = useMemo(
    () => `${webappBaseUrl}${canonical ?? "/"}`,
    [canonical]
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalHref} />
      </Head>

      {isOffline && (
        <p className="text-center">The network connection has been lost.</p>
      )}

      <div className="min-w-screen min-h-screen flex flex-col">
        {message}

        {topbar}

        <div className="flex flex-col grow px-2">{children}</div>
      </div>

      <Toaster position="top-right" />
    </>
  );
};
