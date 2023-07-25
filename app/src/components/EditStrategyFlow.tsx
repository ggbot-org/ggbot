import { ButtonOnClick } from "@ggbot2/design";
import { isStrategyFlow } from "@ggbot2/models";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { BacktestController } from "../components/BacktestController.js";
import { EditStrategyTabs } from "../components/EditStrategyTabs.js";
import { EditStrategyTopbar } from "../components/EditStrategyTopbar.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { MemoryController } from "../components/MemoryController.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";

export const EditStrategyFlow: FC = () => {
  const { strategyKey } = useContext(StrategyContext);
  const strategyKind = strategyKey?.strategyKind;

  const [canSave, setCanSave] = useState(false);
  const [flowChanged, setFlowChanged] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, whenUpdated: whenUpdatedFlow } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    flowViewGraph: flowView?.graph,
    strategyKind,
  });

  const READ = useApi.ReadStrategyFlow();
  const WRITE = useApi.WriteStrategyFlow();

  const storedStrategyFlow = READ.data;
  const readIsPending = READ.isPending;
  const saveIsPending = WRITE.isPending;

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!flowView) return;
    if (!strategyKey) return;
    if (!canSave) return;
    if (WRITE.canRun) WRITE.request({ ...strategyKey, view: flowView.graph });
  }, [WRITE, canSave, flowView, strategyKey]);

  useEffect(() => {
    if (!strategyKey) return;
    if (READ.canRun) READ.request(strategyKey);
  }, [READ, flowLoaded, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (readIsPending) return;
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
      // TODO show error to user
      console.error(error);
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, readIsPending]);

  useEffect(() => {
    if (whenUpdatedFlow) setFlowChanged(true);
  }, [setFlowChanged, whenUpdatedFlow]);

  useEffect(() => {
    // Disable Save button once saving changes start.
    if (saveIsPending) {
      setCanSave(false);
      setFlowChanged(false);
    } else if (flowChanged) {
      // Enable Save button when some change on flow happens.
      setCanSave(true);
    }
  }, [flowChanged, saveIsPending, setCanSave]);

  return (
    <>
      <EditStrategyTopbar
        canSave={canSave}
        onClickSave={onClickSave}
        saveIsPending={saveIsPending}
      />

      <EditStrategyTabs
        flow={
          <>
            <FlowViewContainer ref={flowViewContainerRef} />

            <MemoryController />
          </>
        }
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
