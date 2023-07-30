import { FC } from "react";
import { useIntl } from "react-intl";

import { Name, NameProps } from "../components/Name.js";

export type StrategyNameProps = Omit<NameProps, "label">;

export const StrategyName: FC<StrategyNameProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <Name label={formatMessage({ id: "StrategyName.label" })} {...props} />
  );
};
