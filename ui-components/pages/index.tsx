import type { NextPage } from "next";
import Head from "next/head";
import { Logo } from "../src/Logo";

const Home: NextPage = () => {
  return (
    <>
      <Head>gggot2 ui-components</Head>
      <Logo size={20} />
    </>
  );
};

export default Home;
