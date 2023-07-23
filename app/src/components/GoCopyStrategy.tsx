import { Button, ButtonOnClick } from "@ggbot2/design";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { href } from "../routing/hrefs.js";

export const GoCopyStrategy: FC = () => {
  const { strategyKey } = useContext(StrategyContext);

  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (!strategyKey) return;
      if (isLoading) return;
      setIsLoading(true);
      window.location.href = href.copyStrategyPage(strategyKey);
    },
    [isLoading, strategyKey]
  );

  return (
    <Button type="button" isLoading={isLoading} onClick={onClick}>
    <FormattedMessage id="buttonLabel.copy"/>
    </Button>
  );
};
