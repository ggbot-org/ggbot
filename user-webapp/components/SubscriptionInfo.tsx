import { Box, Control, Field, InputField, Pill, useFormattedDate } from "@ggbot2/design";
import { FC, useContext } from "react";
import { SubscriptionContext } from "_contexts";

export const SubscriptionInfo: FC = () => {
  const { subscriptionEnd, subscriptionPlan } = useContext(SubscriptionContext);

  const formattedSubscriptionEnd = useFormattedDate(subscriptionEnd, "day");

  return (
    <Box title="Subscription">
      <Field>
        <Control>
          <Pill color="primary">active</Pill>
        </Control>
      </Field>

      <InputField label="Plan" defaultValue={subscriptionPlan} readOnly />

      <InputField label="End day" defaultValue={formattedSubscriptionEnd} readOnly />
    </Box>
  );
};
