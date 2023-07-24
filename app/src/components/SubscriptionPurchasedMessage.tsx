import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

export const SubscriptionPurchasedMessage: FC = () => (
  <Message color="success">
    <FormattedMessage id="SubscriptionPurchasedMessage.body" />
  </Message>
);
