import type { NextPage } from "next";
import Head from "next/head";
import { Navigation } from "_components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Navigation />
    </>
  );
};

export default Home;
