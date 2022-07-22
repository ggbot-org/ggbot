import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "../src/Button";
import { Logo } from "../src/Logo";
import { SimpleTable } from "../examples";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 ui-components</title>
      </Head>

      <Logo size={20} />

      <div className="flex flex-row gap-10">
        <Button>button</Button>
        <Button color="primary">primary</Button>
        <Button color="danger">danger</Button>
      </div>

      <SimpleTable />
    </>
  );
};

export default Home;
