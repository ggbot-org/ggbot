import { Column, Columns, Container, Section, classNames } from "@ggbot2/design";
import { FC } from "react";
import { AccountSettings, Navigation, Page } from "_components";

export const SettingsAccount: FC = () => {
  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <h1 className={classNames("title")}>Account</h1>

          <Columns>
            <Column size="half">
              <AccountSettings />
            </Column>
          </Columns>
        </Container>
      </Section>
    </Page>
  );
};
