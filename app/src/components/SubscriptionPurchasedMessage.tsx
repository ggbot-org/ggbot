import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

export const SubscriptionPurchasedMessage: FC = () => (
  <Message color="success">
    <p>
      <FormattedMessage id="SubscriptionPurchasedMessage.body" />
    </p>
  </Message>
);
