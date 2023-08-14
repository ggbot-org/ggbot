import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<
  InputFieldProps,
  "label" | "readOnly" | "isStatic" | "defaultValue"
>;

export const StrategyId: FC<Props> = ({ value, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      readOnly
      isStatic
      label={formatMessage({ id: "StrategyId.label" })}
      defaultValue={value}
      {...props}
    />
  );
};
