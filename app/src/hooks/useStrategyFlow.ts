import { useContext, useEffect, useRef } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";

export const useStrategyFlow = () => {
  const { strategyFlow: flow } = useContext(StrategyContext);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, whenUpdatedFlow } = useFlowView(flowViewContainerRef);

  const backtesting = useBacktesting(flowView?.graph);

  useEffect(() => {
    if (!flowView) return;
    if (flow === undefined) return;
    if (flow === null) return; // TODO set "Welcome flow"
    flowView.clearGraph();
    flowView.loadGraph(flow.view);
  }, [flowView, flow]);

  return {
    backtesting,
    flowViewContainerRef,
    flowViewGraph: flowView?.graph,
    whenUpdatedFlow,
  };
};
