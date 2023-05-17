import { Navigation } from "_components/Navigation";
import { Page } from "_components/Page";
import { Column, Columns, Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

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
