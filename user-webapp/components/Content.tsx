import Head from "next/head";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Navigation } from "./Navigation";
import { pageContentPaddingTop } from "./classNames";

type Props = {
  children: ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
};

export const Content: FC<Props> = ({
  children,
  metadata = { title: "ggbot2", description: "crypto flow" },
}) => {
  const className = `${pageContentPaddingTop} px-2 w-screen`;
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <Navigation />

      <div className={className}>{children}</div>

      <Toaster position="top-right" />
    </>
  );
};
