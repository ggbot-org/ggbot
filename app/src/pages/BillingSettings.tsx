import { Column, Columns, Section } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
// TODO use trunx Menu to on every settings page
import { SubscriptionInfo } from "../components/SubscriptionInfo.js";
import { SubscriptionPurchase } from "../components/SubscriptionPurchase.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";

export const BillingSettingsPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <PageContainer>
        <SubscriptionProvider>
          <Section>
            <Columns>
              <Column>
                <SubscriptionInfo />
              </Column>

              <Column>
                <SubscriptionPurchase />
              </Column>
            </Columns>
          </Section>
        </SubscriptionProvider>
      </PageContainer>
    </AuthenticationProvider>
  </I18nProvider>
);
