import Head from "next/head";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Content: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>ggbot2 admin</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <div className="min-w-screen min-h-screen flex flex-col">
        <div className="flex flex-col grow px-2">{children}</div>
      </div>
    </>
  );
};
