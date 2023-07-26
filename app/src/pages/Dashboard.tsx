import { ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const DashboardPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <ToastProvider>
          <OneSectionLayout>
            <CreateStrategy />

            <Strategies />
          </OneSectionLayout>
        </ToastProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
