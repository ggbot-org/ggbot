import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { ReadonlyFlow } from "../components/ReadonlyFlow.js";
import { Tabs } from "../components/Tabs.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const TryFlow: FC = () => {
  const { backtesting, flowViewContainerRef } = useStrategyFlow();

  return (
    <Tabs
      initialTabId="flow"
      tabs={[
        {
          tabId: "backtesting",
          content: <Backtesting {...backtesting} />,
        },
        {
          tabId: "flow",
          content: <ReadonlyFlow flowViewContainerRef={flowViewContainerRef} />,
        },
      ]}
    />
  );
};
