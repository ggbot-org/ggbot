import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label">;

export const OneTimePassword: FC<Props> = ({ value, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      label={formatMessage({ id: "OneTimePassword.label" })}
      value={value}
      {...props}
    />
  );
};
