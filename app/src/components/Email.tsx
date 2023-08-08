import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "type">;

export const Email: FC<Props> = ({ isStatic, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      type={isStatic ? "text" : "email"}
      label={formatMessage({ id: "Email.label" })}
      isStatic={isStatic}
      {...props}
    />
  );
};
