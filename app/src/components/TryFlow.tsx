import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { ViewStrategyTabs } from "../components/ViewStrategyTabs.js";
import { ViewStrategyTopbar } from "../components/ViewStrategyTopbar.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

// TODO rename ViewStrategy* components
export const TryFlow: FC = () => {
  const { backtesting, flowViewContainerRef } = useStrategyFlow();

  return (
    <>
      <ViewStrategyTopbar />

      <ViewStrategyTabs
        backtest={<Backtesting {...backtesting} />}
        flow={<FlowViewContainer ref={flowViewContainerRef} />}
      />
    </>
  );
};
