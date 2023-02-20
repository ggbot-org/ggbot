import { NextPage } from "next";
import Head from "next/head";
import {
  ButtonColors,
  Charts,
  Colors,
  EditableInputs,
  Icons,
  LoadingButtons,
  GroupedPills,
  Pills,
  SimpleForm,
  SimpleTable,
  Typography,
} from "_examples";
import { Nav } from "_components";
import { Logo } from "@ggbot2/design";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 design</title>
      </Head>

      <Nav />

      <main>
        <Logo size={71} />

        <Colors />

        <Typography />

        <SimpleForm />

        <ButtonColors />

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
