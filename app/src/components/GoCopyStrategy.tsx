import { Button, ButtonOnClick } from "@ggbot2/design";
import { FC, useCallback, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { href } from "../routing/hrefs.js";

export const GoCopyStrategy: FC = () => {
  const { strategy } = useContext(StrategyContext);

  const onClick = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      window.location.href = href.copyStrategyPage({
        strategyId: strategy.id,
        strategyKind: strategy.kind,
      });
    },
    [strategy]
  );

  return (
    <Button type="button" onClick={onClick}>
      <FormattedMessage id="GoCopyStrategy.label" />
    </Button>
  );
};
