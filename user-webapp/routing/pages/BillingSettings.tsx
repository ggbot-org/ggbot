import { Columns, Column } from "@ggbot2/design";
import { FC } from "react";
import { SubscriptionInfo } from "_components/SubscriptionInfo";
import { SubscriptionPurchase } from "_components/SubscriptionPurchase";
import { OneSectionLayout } from "_layouts/OneSection";

export const BillingSettingsPage: FC = () => (
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
  );
