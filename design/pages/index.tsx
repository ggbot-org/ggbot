import { NextPage } from "next";
import Head from "next/head";
import {
  ButtonColors,
  Charts,
  EditableInputs,
  Icons,
  LoadingButtons,
  Tags,
  SimpleForm,
  SimpleTable,
  Typography,
} from "_examples";
import { Columns, Column, Container, Logo, Navbar } from "@ggbot2/design";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 design</title>
      </Head>

      <Navbar />

      <main>
        <Container>
          <Logo size={71} />

          <Typography />

          <Columns isCentered>
            <Column size="half">
              <SimpleForm />
            </Column>
          </Columns>

          <ButtonColors />

          <LoadingButtons />

          <EditableInputs />

          <Icons />

          <Tags />

          <SimpleTable />

          <Charts />
        </Container>
      </main>
    </>
  );
};

export default Home;
