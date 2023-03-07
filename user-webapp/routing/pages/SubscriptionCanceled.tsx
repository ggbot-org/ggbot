import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts";

export const SubscriptionCanceledPage: FC = () => {
  return (
    <OneSectionLayout>
      <Message>
        <p>Your purchase was canceled.</p>
      </Message>
    </OneSectionLayout>
  );
};
