import { Column, Columns, Section } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { PageContainer } from "../components/PageContainer.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const AccountSettingsPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <PageContainer maxWidth="widescreen">
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
      </PageContainer>
    </AuthenticationProvider>
  </I18nProvider>
);
