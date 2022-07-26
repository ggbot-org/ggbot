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
      {children}
    </>
  );
};
