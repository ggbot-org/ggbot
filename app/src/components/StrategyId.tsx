import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "readOnly">;

export const StrategyId: FC<Props> = ({ value }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      readOnly
      label={formatMessage({ id: "StrategyId.label" })}
      value={value}
    />
  );
};
