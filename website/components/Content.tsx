import Head from "next/head";
import { FC, ReactNode } from "react";

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
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <div className="w-screen px-2">{children}</div>
    </>
  );
};
