import { Checkmark, CheckmarkProps } from "@ggbot2/ui-components";
import { ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Navigation } from "_components";
import styles from "../styles/PrivacyAndTerms.module.css";

type Step = Pick<CheckmarkProps, "ok"> & {
  content: ReactNode;
};

const Page: NextPage = () => {
  const steps: Step[] = [
    {
      content: <span>Up and running</span>,
      ok: true,
    },
    {
      content: <span>NFT strategies</span>,
      ok: false,
    },
    {
      content: <span>Open source</span>,
      ok: false,
    },
  ];

  return (
    <div>
      <Head>
        <title>ggbot2</title>
      </Head>

      <Navigation />

      <main className={styles.main}>
        <h1>Roadmap</h1>

        <ul className="my-4">
          {steps.map(({ content, ok }) => (
            <div className="flex my-2">
              <Checkmark ok={ok} />
              {content}
            </div>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Page;
