import Head from "next/head";
import { FC, ReactNode } from "react";
import { Navigation } from "./Navigation";
import { pageContentGapTopHeight } from "./classNames";

type Props = {
  children: ReactNode;
};

export const Page: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Navigation />

      <div className={pageContentGapTopHeight} />
      <div className="px-2">{children}</div>
    </>
  );
};
