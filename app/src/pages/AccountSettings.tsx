import { Column, Columns } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const AccountSettingsPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <OneSectionLayout>
        <Columns>
          <Column size="half">
            <AccountSettings />
          </Column>
        </Columns>

        <DeleteAccount />
      </OneSectionLayout>
    </AuthenticationProvider>
  </I18nContextProvider>
);
