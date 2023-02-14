import { NextPage } from "next";
import Head from "next/head";
import {
  Buttons,
  Charts,
  Colors,
  EditableInputs,
  Icons,
  LoadingButtons,
  Navigation,
  GroupedPills,
  Pills,
  SimpleForm,
  SimpleTable,
  Typography,
} from "../examples";
import { Logo } from "../src";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 design</title>
      </Head>

      <Navigation />

      <main>
        <Logo size={71} />

        <Colors />

        <Typography />

        <SimpleForm />

        <Buttons />

        <LoadingButtons />

        <EditableInputs />

        <Icons />

        <Pills />
        <GroupedPills />

        <SimpleTable />

        <Charts />
      </main>
    </>
  );
};

export default Home;
