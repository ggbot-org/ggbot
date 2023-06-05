import { Column, Columns, Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

import { Navigation } from "../components/Navigation.js";
import { Page } from "../components/Page.js";

// TODO remove this
export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <Page topbar={<Navigation noMenu />}>
    <Section>
      <Container>
        <Columns>
          <Column size="half">{children}</Column>
        </Columns>
      </Container>
    </Section>
  </Page>
);
