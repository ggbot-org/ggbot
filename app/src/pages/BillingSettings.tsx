import { Column, Columns } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

import { SubscriptionInfo } from "../components/SubscriptionInfo.js";
import { SubscriptionPurchase } from "../components/SubscriptionPurchase.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

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
