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
import { Columns, Column, Container, Logo } from "@ggbot2/design";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 design</title>
      </Head>

      <Nav />

      <main>
        <Container>
          <Logo size={71} />

          <Colors />

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

          <Pills />
          <GroupedPills />

          <SimpleTable />

          <Charts />
        </Container>
      </main>
    </>
  );
};

export default Home;
