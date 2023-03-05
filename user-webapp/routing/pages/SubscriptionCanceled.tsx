import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts";

export const SubscriptionCanceledPage: FC = () => {
  return (
    <OneSectionLayout>
      <Message color="warning">Your purchase was canceled.</Message>
    </OneSectionLayout>
  );
};
