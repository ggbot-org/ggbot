import type { NextPage } from "next";
import Head from "next/head";
import {
  Buttons,
  Colors,
  EditableInputs,
  Heading,
  Icons,
  LoadingButtons,
  Navigation,
  GroupedPills,
  Pills,
  SimpleForm,
  SimpleTable,
} from "../examples";
import { Logo } from "../src";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 ui-components</title>
      </Head>

      <Navigation />

      <main>
        <Logo size={71} />

        <Colors />

        <Heading />

        <SimpleForm />

        <Buttons />

        <LoadingButtons />

        <EditableInputs />

        <Icons />

        <Pills />
        <GroupedPills />

        <SimpleTable />
      </main>
    </>
  );
};

export default Home;
