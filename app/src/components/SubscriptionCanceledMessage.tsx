import { Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

export const SubscriptionCanceledMessage: FC = () => (
  <Message color="warning">
    <p>
      <FormattedMessage id="SubscriptionCanceledMessage.body" />
    </p>
  </Message>
);
