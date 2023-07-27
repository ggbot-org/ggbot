import {
  Column,
  Columns,
  Container,
  Logo,
  Section,
  Title as _Title,
  ToastProvider,
  TopNavbar,
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
import { ToastExample } from "../examples/Toast.js";
import { Typography } from "../examples/Typography.js";

const Title: FC<PropsWithChildren> = ({ children }) => (
  <_Title size={1}>{children}</_Title>
);

const Page: FC = () => (
  <ToastProvider>
    <TopNavbar noMenu />

    <main>
      <Container>
        <Section>
          <Logo size={71} />
        </Section>

        <Section>
          <Title>Typography</Title>

          <Typography />
        </Section>

        <Section>
          <Title>Palette</Title>

          <Palette />
        </Section>

        <Section>
          <Title>Inputs</Title>

          <Columns>
            <Column size="half">
              <InputFields />
            </Column>
          </Columns>
        </Section>

        <Section>
          <Title>Forms</Title>

          <Columns>
            <Column size="half">
              <SimpleForm />
            </Column>
          </Columns>
        </Section>

        <Section>
          <Title>Buttons</Title>

          <ButtonColors />

          <LoadingButtons />
        </Section>

        <Section>
          <Title>Time interval selectors</Title>

          <TimeIntervalSelectors />
        </Section>

        <Section>
          <Title>Icons</Title>

          <Icons />
        </Section>

        <Section>
          <Title>Tags</Title>

          <Tags />
        </Section>

        <Section>
          <Title>Tables</Title>

          <SimpleTable />
        </Section>

        <Section>
          <Title>Toast</Title>

          <ToastExample />
        </Section>
      </Container>
    </main>
  </ToastProvider>
);

mount(Page);
