import { Column, Columns, Section } from "@ggbot2/design";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
// TODO use trunx Menu to on every settings page
import { SubscriptionInfo } from "../components/SubscriptionInfo.js";
import { SubscriptionPurchase } from "../components/SubscriptionPurchase.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";

export const BillingSettingsPage: FC = () => (
  <PageContainer maxWidth="widescreen">
    <AuthenticationProvider>
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
    </AuthenticationProvider>
  </PageContainer>
);
