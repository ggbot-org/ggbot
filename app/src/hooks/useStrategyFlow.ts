import { useContext, useEffect, useRef } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";

export const useStrategyFlow = () => {
  const { strategy, strategyFlow: flow } = useContext(StrategyContext);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind: strategy.kind,
  });

  const backtesting = useBacktesting({
    flowViewGraph: flowView?.graph,
    strategyKind: strategy.kind,
  });

  useEffect(() => {
    if (!flowView) return;
    if (!flow) return;
    flowView.clearGraph();
    flowView.loadGraph(flow.view);
  }, [flowView, flow]);

  return { backtesting, flowViewContainerRef };
};
