import { Column, Columns, Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";
import { Page, Navigation } from "_components";

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
