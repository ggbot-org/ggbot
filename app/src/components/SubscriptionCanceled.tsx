import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

// TODO rename in purchase canceled
export const SubscriptionCanceled: FC = () => (
  <Message color="warning">
    <FormattedMessage id="SubscriptionCanceled.message" />
  </Message>
);