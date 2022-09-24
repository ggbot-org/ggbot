import { Main } from "@ggbot2/ui-components";
import Head from "next/head";
import { FC, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
  topbar?: ReactNode;
};

export const Content: FC<Props> = ({
  children,
  metadata = { title: "ggbot2", description: "crypto flow" },
  topbar,
}) => {
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

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      {isOffline && (
        <p className="text-center">The network connection has been lost.</p>
      )}

      {topbar}

      <Main>{children}</Main>

      <Toaster position="top-right" />
    </>
  );
};
