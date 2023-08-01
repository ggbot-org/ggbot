import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { Strategy } from "../components/Strategy.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { StrategyFlowProvider } from "../contexts/StrategyFlow.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";

export const StrategyPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <PageContainer>
        <AccountStrategiesProvider>
          <SubscriptionProvider>
            <StrategyProvider>
              <StrategyFlowProvider>
                <Strategy />
              </StrategyFlowProvider>
            </StrategyProvider>
          </SubscriptionProvider>
        </AccountStrategiesProvider>
      </PageContainer>
    </AuthenticationProvider>
  </I18nProvider>
);
