import { Box, Control, Field, InputField, Tag, Title, useFormattedDate } from "@ggbot2/design";
import { FC, useContext } from "react";
import { SubscriptionContext } from "_contexts";

export const SubscriptionInfo: FC = () => {
  const { subscriptionEnd, subscriptionPlan } = useContext(SubscriptionContext);

  const formattedSubscriptionEnd = useFormattedDate(subscriptionEnd, "day");

  return (
    <Box>
      <Title>Subscription</Title>

      <Field>
        <Control>
          <Tag color="primary">active</Tag>
        </Control>
      </Field>

      <InputField label="Plan" defaultValue={subscriptionPlan} readOnly />

      <InputField label="End day" defaultValue={formattedSubscriptionEnd} readOnly />
    </Box>
  );
};
