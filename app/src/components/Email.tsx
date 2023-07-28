import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label">;

export const Email: FC<Props> = ({ value }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField label={formatMessage({ id: "Email.label" })} value={value} />
  );
};
