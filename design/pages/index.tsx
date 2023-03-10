import { NextPage } from "next";
import Head from "next/head";
import {
  ButtonColors,
  Charts,
  EditableInputs,
  Icons,
  LoadingButtons,
  SingleCalendar,
  Tags,
  SimpleForm,
  SimpleTable,
  Typography,
} from "_examples";
import { Columns, Column, Container, Logo, Navbar, Section, Title } from "@ggbot2/design";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2 design</title>
      </Head>

      <Navbar />

      <main>
        <Section>
          <Container>
            <Logo size={71} />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Typography</Title>

            <Typography />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Forms</Title>

            <Columns>
              <Column size="half">
                <SimpleForm />
              </Column>
            </Columns>
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Buttons</Title>

            <ButtonColors />

            <LoadingButtons />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Editable input</Title>

            <EditableInputs />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Icons</Title>

            <Icons />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Tags</Title>

            <Tags />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Calendars</Title>

            <SingleCalendar />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Tables</Title>

            <SimpleTable />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Charts</Title>

            <Charts />
          </Container>
        </Section>
      </main>
    </>
  );
};

export default Home;
