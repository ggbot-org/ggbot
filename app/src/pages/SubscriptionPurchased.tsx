import { Section } from "@ggbot2/design";
import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { SubscriptionPurchased } from "../components/SubscriptionPurchased.js";

export const SubscriptionPurchasedPage: FC = () => (
  <PageContainer maxWidth="widescreen">
    <Section>
      <SubscriptionPurchased />
    </Section>
  </PageContainer>
);
