import { Column, Columns, ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const AccountSettingsPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <ToastProvider>
        <OneSectionLayout>
          <Columns>
            <Column size="half">
              <AccountSettings />
            </Column>
          </Columns>

          <DeleteAccount />
        </OneSectionLayout>
      </ToastProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
