import { Columns, Column } from "@ggbot2/design";
import { FC } from "react";
import { SubscriptionInfo, SubscriptionPurchase } from "_components";
import { OneSectionLayout } from "_layouts";

export const SettingsBillingPage: FC = () => {
  return (
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
};
