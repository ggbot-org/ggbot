import type { NextPage } from "next";
import Head from "next/head";
import {
  Buttons,
  Colors,
  IconList,
  LoadingButtons,
  SimpleForm,
  SimpleTable,
} from "../examples";
import { Logo } from "../src/Logo";
import { Main } from "../src/Main";
import { Navbar, NavbarBrand } from "../src/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 ui-components</title>
      </Head>

      <Navbar>
        <NavbarBrand />
      </Navbar>

      <Main>
        <Logo size={71} />

        <Colors />

        <SimpleForm />

        <Buttons />

        <LoadingButtons />

        <IconList />

        <SimpleTable />
      </Main>
    </>
  );
};

export default Home;
