import { Box, Control, Field, Tag, Title } from "@ggbot2/design";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { SubscriptionEnd } from "../components/SubscriptionEnd.js";
import { SubscriptionPlan } from "../components/SubscriptionPlan.js";
import { SubscriptionContext } from "../contexts/Subscription.js";
import { schedulingStatusLabel } from "../i18n/index.js";

export const SubscriptionInfo: FC = () => {
  const { hasActiveSubscription, subscriptionEnd, subscriptionPlan } =
    useContext(SubscriptionContext);

  return (
    <Box>
      <Title>
        <FormattedMessage id="SubscriptionInfo.title" />
      </Title>

      <Field>
        <Control>
          {hasActiveSubscription === true ? (
            <Tag color="primary">{schedulingStatusLabel.active}</Tag>
          ) : hasActiveSubscription === false ? (
            <Tag color="light">{schedulingStatusLabel.inactive}</Tag>
          ) : null}
        </Control>
      </Field>

      <SubscriptionPlan readOnly value={subscriptionPlan} />

      <SubscriptionEnd readOnly value={subscriptionEnd} />
    </Box>
  );
};
