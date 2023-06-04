import { ButtonOnClick } from "@ggbot2/design";
import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import {
  ErrorAccountItemNotFound,
  isStrategyExecutionStatus,
  isStrategyFlow,
  StrategyExecution,
} from "@ggbot2/models";
import { mount } from "@ggbot2/react";
import { isTime } from "@ggbot2/time";
import { isMaybeObject } from "@ggbot2/type-utils";
import { DflowExecutionNodeInfo } from "dflow";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { BacktestController } from "../components/BacktestController.js";
import { EditStrategyTabs } from "../components/EditStrategyTabs.js";
import { EditStrategyTopbar } from "../components/EditStrategyTopbar.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { MemoryController } from "../components/MemoryController.js";
import { PleaseConfigureBinanceModal } from "../components/PleaseConfigureBinanceModal.js";
import { StrategyExecutionLog } from "../components/StrategyExecutionLog.js";
import { useApi } from "../hooks/useApi.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";
import { errorMessage } from "../i18n/index.js";
import { PageLayout } from "../layouts/Page.js";
import { StrategyInfo } from "../routing/types.js";

type Props = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

const Page: FC<Props> = ({ binanceSymbols, name, strategyKey }) => {
  // TODO get props client side
  const [canSave, setCanSave] = useState(false);
  const [flowChanged, setFlowChanged] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);
  const [hasNoBinanceApiConfig, setHasNoBinanceApiConfig] = useState<
    boolean | undefined
  >();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, whenUpdated: whenUpdatedFlow } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind: strategyKey.strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    ...strategyKey,
    binanceSymbols,
    flowViewGraph: flowView?.graph,
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
    if (canSave) WRITE({ ...strategyKey, view: flowView.graph });
  }, [canSave, flowView, WRITE, strategyKey]);

  const onClickRun = useCallback<ButtonOnClick>(() => {
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
    if (!flowLoaded) READ(strategyKey);
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
      console.error(error);
      toast.error("Cannot load flow");
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
    if (status === "failure")
      toast.error(errorMessage.strategyExecutionFailure);
  }, [strategyExecution]);

  return (
    <PageLayout>
      {hasNoBinanceApiConfig ? <PleaseConfigureBinanceModal /> : null}

      <EditStrategyTopbar
        canRun={canRun}
        canSave={canSave}
        name={name}
        onClickRun={onClickRun}
        onClickSave={onClickSave}
        runIsPending={runIsPending}
        saveIsPending={saveIsPending}
        strategyKey={strategyKey}
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
    </PageLayout>
  );
};

mount(Page);
