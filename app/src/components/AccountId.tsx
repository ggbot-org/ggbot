import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "readOnly">;

export const AccountId: FC<Props> = ({ value, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      readOnly
      label={formatMessage({ id: "AccountId.label" })}
      value={value}
      {...props}
    />
  );
};
