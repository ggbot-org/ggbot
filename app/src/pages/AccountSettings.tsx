import { Column, Columns, Section } from "@ggbot2/design";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { PageContainer } from "../components/PageContainer.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const AccountSettingsPage: FC = () => (
  <PageContainer maxWidth="widescreen">
    <AuthenticationProvider>
      <Section>
        <Columns>
          <Column size="half">
            <AccountSettings />
          </Column>
        </Columns>
      </Section>

      <Section>
        <DeleteAccount />
      </Section>
    </AuthenticationProvider>
  </PageContainer>
);
