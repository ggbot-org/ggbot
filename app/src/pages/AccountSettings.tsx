import { Column, Columns, ToastContextProvider } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const AccountSettingsPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <ToastContextProvider>
        <OneSectionLayout>
          <Columns>
            <Column size="half">
              <AccountSettings />
            </Column>
          </Columns>

          <DeleteAccount />
        </OneSectionLayout>
      </ToastContextProvider>
    </AuthenticationProvider>
  </I18nContextProvider>
);
