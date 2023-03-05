import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts";

export const SubscriptionPurchasedPage: FC = () => {
  return (
    <OneSectionLayout>
      <Message color="success">Thank you for your purchase.</Message>
    </OneSectionLayout>
  );
};
