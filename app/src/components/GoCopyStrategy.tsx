import { Button, ButtonOnClick } from "@ggbot2/design";
import { FC, useCallback, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { href } from "../routing/hrefs.js";

export const GoCopyStrategy: FC = () => {
  const { strategyKey } = useContext(StrategyContext);

  const onClick = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      window.location.href = href.copyStrategyPage(strategyKey);
    },
    [strategyKey]
  );

  return (
    <Button type="button" onClick={onClick}>
      <FormattedMessage id="buttonLabel.copy" />
    </Button>
  );
};
