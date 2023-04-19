import { NextPage } from "next";
import Head from "next/head";
import {
  Columns,
  Column,
  Container,
  Logo,
  Navbar,
  Section,
  Title,
} from "@ggbot2/design";
import { ButtonColors, LoadingButtons } from "_examples/Buttons";
import { SingleCalendar } from "_examples/Calendar";
import { EditableInputs } from "_examples/EditableInputs";
import { SimpleForm } from "_examples/Forms";
import { Icons } from "_examples/Icons";
import { InputFields } from "_examples/InputFields";
import { Palette } from "_examples/Palette";
import { SimpleTable } from "_examples/Tables";
import { Tags } from "_examples/Tags";
import { Typography } from "_examples/Typography";

const Home: NextPage = () => (
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
            <Title>Palette</Title>

            <Palette />
          </Container>
        </Section>

        <Section>
          <Container>
            <Title>Inputs</Title>

            <Columns>
              <Column size="half">
                <InputFields />
              </Column>
            </Columns>
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
      </main>
    </>
  );

export default Home;
