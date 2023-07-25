import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { SubscriptionCanceled } from "../components/SubscriptionCanceled.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const SubscriptionCanceledPage: FC = () => (
  <I18nContextProvider>
    <OneSectionLayout>
      <SubscriptionCanceled />
    </OneSectionLayout>
  </I18nContextProvider>
);
