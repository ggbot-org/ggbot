import { Tabs } from "@ggbot2/design";
import { FC, useState } from "react";
import { useIntl } from "react-intl";

import { Backtesting } from "../components/Backtesting.js";
import { ReadonlyFlow } from "../components/ReadonlyFlow.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const TryFlow: FC = () => {
  const { formatMessage } = useIntl();

  const { backtesting, flowViewContainerRef } = useStrategyFlow();

  const [activeTabId, setActiveTabId] = useState("flow");

  return (
    <Tabs
      activeTabId={activeTabId}
      setActiveTabId={setActiveTabId}
      tabs={[
        {
          tabId: "backtest",
          selector: formatMessage({ id: "tabLabel.backtest" }),
          content: <Backtesting {...backtesting} />,
        },
        {
          tabId: "flow",
          selector: formatMessage({ id: "tabLabel.flow" }),
          content: <ReadonlyFlow flowViewContainerRef={flowViewContainerRef} />,
        },
      ]}
    />
  );
};
