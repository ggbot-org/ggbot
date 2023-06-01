import { SubscriptionInfo } from "_components/SubscriptionInfo";
import { SubscriptionPurchase } from "_components/SubscriptionPurchase";
import { OneSectionLayout } from "_layouts/OneSection";
import { Column, Columns } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

const Page: FC = () => (
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

mount(Page);
