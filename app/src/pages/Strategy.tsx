import { Column, Columns, Section, ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { Schedulings } from "../components/Schedulings.js";
import { StrategyInfo } from "../components/StrategyInfo.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
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
                <Section>
                  <Columns>
                    <Column>
                      <StrategyInfo />
                    </Column>

                    <Column>
                      <Schedulings />
                    </Column>
                  </Columns>

                  <Columns>
                    <Column>
                      <StrategyProfits />
                    </Column>
                  </Columns>
                </Section>

                <Section>
                  <DeleteStrategy />
                </Section>

                <PleasePurchase />
              </PageLayout>
            </ToastProvider>
          </StrategyProvider>
        </SubscriptionProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
