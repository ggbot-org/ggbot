import { ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { PleasePurchase } from "../components/PleasePurchase.js";
import { Strategy } from "../components/Strategy.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";
import { PageLayout } from "../layouts/Page.js";

export const StrategyPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <SubscriptionProvider>
          <StrategyProvider>
            <ToastProvider>
              <PageLayout>
                <Strategy />

                <PleasePurchase />
              </PageLayout>
            </ToastProvider>
          </StrategyProvider>
        </SubscriptionProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
