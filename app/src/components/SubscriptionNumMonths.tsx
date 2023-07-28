import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "type">;

export const SubscriptionNumMonths: FC<Props> = ({ onChange, value }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      value={value}
      label={formatMessage({ id: "SubscriptionNumMonths.label" })}
      type="number"
      onChange={onChange}
      min={1}
      max={12}
      step={1}
    />
  );
};
