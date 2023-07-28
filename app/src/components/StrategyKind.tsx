import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "readOnly">;

export const StrategyKind: FC<Props> = ({ value }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      label={formatMessage({ id: "StrategyKind.label" })}
      readOnly
      value={value}
    />
  );
};
