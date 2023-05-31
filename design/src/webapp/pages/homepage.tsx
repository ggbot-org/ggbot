import { ButtonColors, LoadingButtons } from "_examples/Buttons";
import { SingleCalendar } from "_examples/Calendar";
import { SimpleForm } from "_examples/Forms";
import { Icons } from "_examples/Icons";
import { InputFields } from "_examples/InputFields";
import { Palette } from "_examples/Palette";
import { SimpleTable } from "_examples/Tables";
import { Tags } from "_examples/Tags";
import { TimeIntervalSelectors } from "_examples/TimeIntervalSelectors";
import { Typography } from "_examples/Typography";
import {
  Column,
  Columns,
  Container,
  Logo,
  Navbar,
  Section,
  Title,
} from "@ggbot2/design";
import { FC } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => (
  <>
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
          <Title>Time interval selectors</Title>
          <TimeIntervalSelectors />
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

mount(Page);
