import { isStrategyFlow } from "@ggbot2/models";
import { FC, useContext, useEffect, useRef } from "react";

import { BacktestController } from "../components/BacktestController.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { ViewStrategyTabs } from "../components/ViewStrategyTabs.js";
import { ViewStrategyTopbar } from "../components/ViewStrategyTopbar.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";
import { errorMessage } from "../i18n/index.js";

export const ViewStrategyFlow: FC = () => {
  const { strategy, strategyFlow: storedStrategyFlow } =
    useContext(StrategyContext);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind: strategy.kind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    flowViewGraph: flowView?.graph,
    strategyKind: strategy.kind,
  });

  useEffect(() => {
    try {
      if (!flowView) return;
      if (storedStrategyFlow === undefined) return;
      if (storedStrategyFlow === null) {
        return;
      }
      flowView.clearGraph();
      if (isStrategyFlow(storedStrategyFlow)) {
        flowView.loadGraph(storedStrategyFlow.view);
      }
    } catch (error) {
      console.error(error);
      // TODO show error to user
      console.error(errorMessage.couldNotLoadFlow);
    }
  }, [flowView, storedStrategyFlow]);

  return (
    <>
      <ViewStrategyTopbar />

      <ViewStrategyTabs
        flow={<FlowViewContainer ref={flowViewContainerRef} />}
        backtest={
          <BacktestController
            state={backtesting}
            dispatch={backtestingDispatch}
          />
        }
      />
    </>
  );
};
