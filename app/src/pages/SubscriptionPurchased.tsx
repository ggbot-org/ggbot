import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { SubscriptionPurchased } from "../components/SubscriptionPurchased.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const SubscriptionPurchasedPage: FC = () => (
  <I18nContextProvider>
    <OneSectionLayout>
      <SubscriptionPurchased />
    </OneSectionLayout>
  </I18nContextProvider>
);
