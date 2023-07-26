import { Column, Columns, ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { SubscriptionInfo } from "../components/SubscriptionInfo.js";
import { SubscriptionPurchase } from "../components/SubscriptionPurchase.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { SubscriptionProvider } from "../contexts/Subscription.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const BillingSettingsPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <SubscriptionProvider>
        <ToastProvider>
          <OneSectionLayout>
            <Columns>
              <Column>
                <SubscriptionInfo />
              </Column>

              <Column>
                <SubscriptionPurchase />
              </Column>
            </Columns>
          </OneSectionLayout>
        </ToastProvider>
      </SubscriptionProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
