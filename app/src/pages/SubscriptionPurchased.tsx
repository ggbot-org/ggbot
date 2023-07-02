import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { SubscriptionPurchasedMessage } from "../components/SubscriptionPurchasedMessage.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const SubscriptionPurchasedPage: FC = () => (
  <I18nContextProvider>
    <OneSectionLayout>
      <SubscriptionPurchasedMessage />
    </OneSectionLayout>
  </I18nContextProvider>
);
