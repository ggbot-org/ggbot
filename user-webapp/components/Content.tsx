import Head from "next/head";
import { FC, ReactNode } from "react";
import { Navigation } from "./Navigation";
import { pageContentPaddingTop } from "./classNames";

type Props = {
  children: ReactNode;
};

export const Content: FC<Props> = ({ children }) => {
  const className = `${pageContentPaddingTop} px-2 w-fit min-w-full`;
  return (
    <>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Navigation />

      <div className={className}>{children}</div>
    </>
  );
};
