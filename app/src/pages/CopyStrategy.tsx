import { ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { CopyStrategy } from "../components/CopyStrategy.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const CopyStrategyPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <StrategyProvider>
          <ToastProvider>
            <OneSectionLayout>
              <CopyStrategy />
            </OneSectionLayout>
          </ToastProvider>
        </StrategyProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
