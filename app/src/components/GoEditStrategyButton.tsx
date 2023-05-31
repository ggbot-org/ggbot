import { buttonLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import { StrategyInfo } from "_routing/types";
import { Button, ButtonOnClick } from "@ggbot2/design";
import { FC, useState } from "react";

type Props = Pick<StrategyInfo, "strategyKey">;

export const GoEditStrategyButton: FC<Props> = ({ strategyKey }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick: ButtonOnClick = (event) => {
    event.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    window.location.pathname = pathname.editFlowPage(strategyKey);
  };

  return (
    <Button type="button" isLoading={isLoading} onClick={onClick}>
      {buttonLabel.flow}
    </Button>
  );
};
