import { dayFormat, InputField, InputFieldProps } from "@ggbot2/design";
import { Time } from "@ggbot2/time";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "readOnly" | "value"> & {
  value: Time;
};

export const WhenCreated: FC<Props> = ({ value, ...props }) => {
  const { formatDate, formatMessage } = useIntl();

  return (
    <InputField
      readOnly
      label={formatMessage({ id: "WhenCreated.label" })}
      value={formatDate(value, dayFormat)}
      {...props}
    />
  );
};
