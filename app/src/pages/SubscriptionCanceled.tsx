import { Section } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { SubscriptionCanceled } from "../components/SubscriptionCanceled.js";

export const SubscriptionCanceledPage: FC = () => (
  <I18nProvider>
    <PageContainer>
      <Section>
        <SubscriptionCanceled />
      </Section>
    </PageContainer>
  </I18nProvider>
);
