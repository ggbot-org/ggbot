import { Column, Columns } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { SubscriptionInfo } from "../components/SubscriptionInfo.js";
import { SubscriptionPurchase } from "../components/SubscriptionPurchase.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const BillingSettingsPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
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
    </AuthenticationProvider>
  </I18nContextProvider>
);
