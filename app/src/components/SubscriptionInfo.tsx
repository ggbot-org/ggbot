import { Box, Control, Field, Title } from "@ggbot2/design";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { SubscriptionEnd } from "../components/SubscriptionEnd.js";
import { SubscriptionPlan } from "../components/SubscriptionPlan.js";
import { SubscriptionStatus } from "../components/SubscriptionStatus.js";
import { SubscriptionContext } from "../contexts/Subscription.js";

export const SubscriptionInfo: FC = () => {
  const { subscriptionEnd, subscriptionPlan, subscriptionStatus } =
    useContext(SubscriptionContext);

  return (
    <Box>
      <Title>
        <FormattedMessage id="SubscriptionInfo.title" />
      </Title>

      <Field>
        <Control>
          {subscriptionStatus ? (
            <SubscriptionStatus status={subscriptionStatus} />
          ) : null}
        </Control>
      </Field>

      <SubscriptionPlan readOnly value={subscriptionPlan} />

      <SubscriptionEnd readOnly value={subscriptionEnd} />
    </Box>
  );
};
