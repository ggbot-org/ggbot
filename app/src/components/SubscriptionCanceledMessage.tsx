import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

export const SubscriptionCanceledMessage: FC = () => (
  <Message color="warning">
    <FormattedMessage id="SubscriptionCanceledMessage.body" />
  </Message>
);
