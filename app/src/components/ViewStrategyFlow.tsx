import { isStrategyFlow } from "@ggbot2/models";
import { FC, useContext, useEffect, useRef, useState } from "react";

import { BacktestController } from "../components/BacktestController.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { ViewStrategyTabs } from "../components/ViewStrategyTabs.js";
import { ViewStrategyTopbar } from "../components/ViewStrategyTopbar.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";
import { errorMessage } from "../i18n/index.js";

export const ViewStrategyFlow: FC = () => {
  const { strategyKey } = useContext(StrategyContext);
  const strategyKind = strategyKey?.strategyKind;

  const [flowLoaded, setFlowLoaded] = useState(false);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    flowViewGraph: flowView?.graph,
    strategyKind,
  });

  const READ = useApi.ReadStrategyFlow();
  const storedStrategyFlow = READ.data;
  const isPending = READ.isPending;

  useEffect(() => {
    if (!strategyKey) return;
    if (!flowLoaded) {
      if (READ.canRun) READ.request(strategyKey);
    }
  }, [READ, flowLoaded, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (isPending) return;
      if (storedStrategyFlow === undefined) return;
      if (storedStrategyFlow === null) {
        setFlowLoaded(true);
        return;
      }
      flowView.clearGraph();
      if (isStrategyFlow(storedStrategyFlow)) {
        flowView.loadGraph(storedStrategyFlow.view);
      }
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      // TODO show error to user
      console.error(errorMessage.couldNotLoadFlow);
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, isPending]);

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
