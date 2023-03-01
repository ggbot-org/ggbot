import { Column, Columns, Container, Section } from "@ggbot2/design";
import { FC } from "react";
import { AuthExitForm, Navigation, Page } from "_components";

export const AuthExit: FC = () => {
  return (
    <Page topbar={<Navigation noMenu />}>
      <Container>
        <Section>
          <Columns>
            <Column size="half">
              <AuthExitForm />
            </Column>
          </Columns>
        </Section>
      </Container>
    </Page>
  );
};
