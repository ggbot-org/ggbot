import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { Strategy } from "../components/Strategy.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";

export const StrategyPage: FC = () => (
  <PageContainer>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <SubscriptionProvider>
          <StrategyProvider>
            <Strategy />

            <PleasePurchase />
          </StrategyProvider>
        </SubscriptionProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </PageContainer>
);
