import { InputField, InputFieldProps, useFormattedDate } from "@ggbot2/design";
import { Time } from "@ggbot2/time";
import { FC } from "react";
import { useIntl } from "react-intl";

export type SubscriptionEndProps = Omit<InputFieldProps, "label" | "value"> & {
  value: Time | undefined;
};

export const SubscriptionEnd: FC<SubscriptionEndProps> = ({
  value,
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      label={formatMessage({ id: "SubscriptionEnd.label" })}
      value={useFormattedDate(value, "day")}
      {...props}
    />
  );
};
