import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts/OneSection";

export const SubscriptionPurchasedPage: FC = () => {
  return (
    <OneSectionLayout>
      <Message color="success">
        <p>Thank you for your purchase.</p>
      </Message>
    </OneSectionLayout>
  );
};
