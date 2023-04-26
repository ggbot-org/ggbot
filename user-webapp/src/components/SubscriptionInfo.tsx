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
import { SubscriptionContext } from "_contexts/Subscription";
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

      <OutputField
        label={fieldLabel.subscriptionPlan}
        value={subscriptionPlan}
      />

      <OutputField label={fieldLabel.endDay} value={formattedSubscriptionEnd} />
    </Box>
  );
};
