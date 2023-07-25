import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

export const SubscriptionCanceled: FC = () => (
  <Message color="warning">
    <FormattedMessage id="SubscriptionCanceled.message" />
  </Message>
);
