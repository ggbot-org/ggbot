import {
  Box,
  Control,
  Field,
  OutputField,
  Tag,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { FC, useContext } from "react";

import { SubscriptionContext } from "../contexts/Subscription.js";
import { fieldLabel, schedulingStatusLabel, title } from "../i18n/index.js";

export const SubscriptionInfo: FC = () => {
  const { hasActiveSubscription, subscriptionEnd, subscriptionPlan } =
    useContext(SubscriptionContext);

  const formattedSubscriptionEnd = useFormattedDate(subscriptionEnd, "day");

  return (
    <Box>
      <Title>{title.subscription}</Title>

      <Field>
        <Control>
          {hasActiveSubscription === true ? (
            <Tag color="primary">{schedulingStatusLabel.active}</Tag>
          ) : hasActiveSubscription === false ? (
            <Tag color="light">{schedulingStatusLabel.inactive}</Tag>
          ) : null}
        </Control>
      </Field>

      {subscriptionPlan ? (
        <OutputField
          label={fieldLabel.subscriptionPlan}
          value={subscriptionPlan}
        />
      ) : null}

      {formattedSubscriptionEnd ? (
        <OutputField
          label={fieldLabel.endDay}
          value={formattedSubscriptionEnd}
        />
      ) : null}
    </Box>
  );
};
