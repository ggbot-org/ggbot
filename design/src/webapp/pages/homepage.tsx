import {
  Column,
  Columns,
  Container,
  Logo,
  Navbar,
  Section,
  Title as _Title,
} from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC, PropsWithChildren } from "react";

import { ButtonColors, LoadingButtons } from "../examples/Buttons.js";
import { SimpleForm } from "../examples/Forms.js";
import { Icons } from "../examples/Icons.js";
import { InputFields } from "../examples/InputFields.js";
import { Palette } from "../examples/Palette.js";
import { SimpleTable } from "../examples/Tables.js";
import { Tags } from "../examples/Tags.js";
import { TimeIntervalSelectors } from "../examples/TimeIntervalSelectors.js";
import { Typography } from "../examples/Typography.js";

const Title: FC<PropsWithChildren> = ({ children }) => (
  <_Title size={1}>{children}</_Title>
);

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
          <Title>Tables</Title>
          <SimpleTable />
        </Container>
      </Section>
    </main>
  </>
);

mount(Page);
