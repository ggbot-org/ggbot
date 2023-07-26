import { OutputField, OutputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Pick<OutputFieldProps, "value">;

export const StrategyName: FC<Props> = ({ value }) => {
  const { formatMessage } = useIntl();

  return (
    <OutputField
      label={formatMessage({ id: "StrategyName.label" })}
      value={value}
    />
  );
};
