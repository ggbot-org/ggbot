import { Section } from "@ggbot2/design";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { SubscriptionCanceled } from "../components/SubscriptionCanceled.js";

export const SubscriptionCanceledPage: FC = () => (
  <PageContainer maxWidth="widescreen">
    <Section>
      <SubscriptionCanceled />
    </Section>
  </PageContainer>
);
