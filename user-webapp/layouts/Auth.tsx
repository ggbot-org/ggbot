import { Column, Columns, Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";
import { Navigation } from "_components/Navigation";
import { Page } from "_components/Page";

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
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
};