import { dayFormat, InputField, InputFieldProps } from "@ggbot2/design";
import { Time } from "@ggbot2/time";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<
  InputFieldProps,
  "label" | "defaultValue" | "value" | "isStatic"
> & {
  value: Time;
};

export const WhenCreated: FC<Props> = ({ value, ...props }) => {
  const { formatDate, formatMessage } = useIntl();

  return (
    <InputField
      isStatic
      label={formatMessage({ id: "WhenCreated.label" })}
      defaultValue={formatDate(value, dayFormat)}
      {...props}
    />
  );
};
