import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { SubscriptionCanceledMessage } from "../components/SubscriptionCanceledMessage.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const SubscriptionCanceledPage: FC = () => (
  <I18nContextProvider>
    <OneSectionLayout>
      <SubscriptionCanceledMessage />
    </OneSectionLayout>
  </I18nContextProvider>
);
