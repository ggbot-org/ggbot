import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts/OneSection";

export const SubscriptionCanceledPage: FC = () => {
  return (
    <OneSectionLayout>
      <Message color="warning">
        <p>Your purchase was canceled.</p>
      </Message>
    </OneSectionLayout>
  );
};
