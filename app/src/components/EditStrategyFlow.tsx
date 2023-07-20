import { ButtonOnClick } from "@ggbot2/design";
import {
  ErrorAccountItemNotFound,
  isStrategyExecutionStatus,
  isStrategyFlow,
  StrategyExecution,
} from "@ggbot2/models";
import { isTime } from "@ggbot2/time";
import { isMaybeObject } from "@ggbot2/type-utils";
import { DflowExecutionNodeInfo } from "dflow";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";
import { errorMessage } from "../i18n/index.js";
import { BacktestController } from "./BacktestController.js";
import { EditStrategyTabs } from "./EditStrategyTabs.js";
import { EditStrategyTopbar } from "./EditStrategyTopbar.js";
import { FlowViewContainer } from "./FlowViewContainer.js";
import { MemoryController } from "./MemoryController.js";
import { PleaseConfigureBinanceModal } from "./PleaseConfigureBinanceModal.js";
import { StrategyExecutionLog } from "./StrategyExecutionLog.js";

export const EditStrategyFlow: FC = () => {
  const { strategyKey } = useContext(StrategyContext);
  const strategyKind = strategyKey?.strategyKind;

  const [canSave, setCanSave] = useState(false);
  const [flowChanged, setFlowChanged] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);
  const [hasNoBinanceApiConfig, setHasNoBinanceApiConfig] = useState<
    boolean | undefined
  >();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, whenUpdated: whenUpdatedFlow } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    flowViewGraph: flowView?.graph,
    strategyKind,
  });

  const [
    EXECUTE,
    {
      data: strategyExecution,
      isPending: runIsPending,
      error: strategyExecutionError,
    },
  ] = useApi.ExecuteStrategy();

  const [WRITE, { isPending: saveIsPending }] = useApi.WriteStrategyFlow();

  const [READ, { data: storedStrategyFlow, isPending: readIsPending }] =
    useApi.ReadStrategyFlow();

  let canRun = !canSave;
  if (hasNoBinanceApiConfig) canRun = false;
  if (!flowLoaded) canRun = false;
  if (runIsPending) canRun = false;
  if (saveIsPending) canRun = false;

  const { executionStatus, executionSteps, executionWhenUpdated } =
    useMemo(() => {
      if (!isMaybeObject<StrategyExecution>(strategyExecution))
        return {
          executionWhenUpdated: undefined,
          executionSteps: undefined,
          executionStatus: undefined,
        };
      const { status, steps, whenUpdated } = strategyExecution;
      const executionStatus = isStrategyExecutionStatus(status)
        ? status
        : undefined;
      const executionWhenUpdated = isTime(whenUpdated)
        ? whenUpdated
        : undefined;
      return {
        executionSteps: steps as DflowExecutionNodeInfo[],
        executionStatus,
        executionWhenUpdated,
      };
    }, [strategyExecution]);

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!flowView) return;
    if (!strategyKey) return;
    if (canSave) WRITE({ ...strategyKey, view: flowView.graph });
  }, [canSave, flowView, WRITE, strategyKey]);

  const onClickRun = useCallback<ButtonOnClick>(() => {
    if (!strategyKey) return;
    if (canRun) EXECUTE(strategyKey);
  }, [canRun, EXECUTE, strategyKey]);

  useEffect(() => {
    if (!strategyExecutionError) return;
    if (hasNoBinanceApiConfig) return;
    if (strategyExecutionError.name === ErrorAccountItemNotFound.name) {
      // TODO type guards or other util for errors
      // check that strategyExecutionError.info.type === 'BinanceApiConfig'
      setHasNoBinanceApiConfig(true);
    }
  }, [strategyExecutionError, hasNoBinanceApiConfig, setHasNoBinanceApiConfig]);

  useEffect(() => {
    if (flowLoaded) return;
    if (!strategyKey) return;
    const controller = READ(strategyKey);
    return () => controller.abort();
  }, [flowLoaded, READ, strategyKey]);

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

  useEffect(() => {
    if (!isMaybeObject<StrategyExecution>(strategyExecution)) return;
    const { status } = strategyExecution;
    if (!isStrategyExecutionStatus(status)) return;
    if (status === "failure") {
      // TODO show error to user
      console.error(errorMessage.strategyExecutionFailure);
    }
  }, [strategyExecution]);

  return (
    <>
      {hasNoBinanceApiConfig ? <PleaseConfigureBinanceModal /> : null}

      <EditStrategyTopbar
        canRun={canRun}
        canSave={canSave}
        onClickRun={onClickRun}
        onClickSave={onClickSave}
        runIsPending={runIsPending}
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
        executionLog={
          <StrategyExecutionLog
            status={executionStatus}
            steps={executionSteps}
            whenUpdated={executionWhenUpdated}
          />
        }
      />
    </>
  );
};
