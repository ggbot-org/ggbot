import { Box, Control, Field, InputField, Tag, Title, useFormattedDate } from "@ggbot2/design";
import { FC, useContext } from "react";
import { SubscriptionContext } from "_contexts";
import { fieldLabel } from "_i18n";

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

      <InputField label={fieldLabel.subscriptionPlan} defaultValue={subscriptionPlan} readOnly />

      <InputField label={fieldLabel.endDay} defaultValue={formattedSubscriptionEnd} readOnly />
    </Box>
  );
};
