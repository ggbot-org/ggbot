import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { ReadonlyFlow } from "../components/ReadonlyFlow.js";
import { TryFlowTabs } from "../components/TryFlowTabs.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const TryFlow: FC = () => {
  const { backtesting, flowViewContainerRef } = useStrategyFlow();

  return (
    <TryFlowTabs
      backtest={<Backtesting {...backtesting} />}
      flow={<ReadonlyFlow flowViewContainerRef={flowViewContainerRef} />}
    />
  );
};
