import type { NextPage } from "next";
import Head from "next/head";
import { Logo } from "../src/Logo";
import { Buttons, LoadingButtons, SimpleTable } from "../examples";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 ui-components</title>
      </Head>

      <Logo size={20} />

      <Buttons />

      <LoadingButtons />

      <SimpleTable />
    </>
  );
};

export default Home;
