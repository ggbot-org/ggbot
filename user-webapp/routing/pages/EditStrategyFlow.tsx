import { ErrorAccountItemNotFound } from "@ggbot2/database";
import { ButtonOnClick } from "@ggbot2/design";
import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import {
  StrategyExecution,
  isStrategyExecutionStatus,
  isStrategyFlow,
} from "@ggbot2/models";
import { isTime } from "@ggbot2/time";
import { isMaybeObject } from "@ggbot2/type-utils";
import { DflowExecutionNodeInfo } from "dflow";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BacktestController } from "_components/BacktestController";
import { EditStrategyTopbar } from "_components/EditStrategyTopbar";
import { EditStrategyTabs } from "_components/EditStrategyTabs";
import { FlowViewContainer } from "_components/FlowViewContainer";
import { MemoryController } from "_components/MemoryController";
import { PleaseConfigureBinanceModal } from "_components/PleaseConfigureBinanceModal";
import { StrategyExecutionLog } from "_components/StrategyExecutionLog";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import { errorMessage } from "_i18n";
import { PageLayout } from "_layouts/Page";
import { StrategyInfo } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const EditStrategyFlowPage: FC<Props> = ({
  binanceSymbols,
  name,
  strategyKey,
}) => {
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
    execute,
    {
      data: strategyExecution,
      isPending: runIsPending,
      error: strategyExecutionError,
    },
  ] = useApiAction.ExecuteStrategy();

  const [saveStrategyFlow, { isPending: saveIsPending }] =
    useApiAction.WriteStrategyFlow();

  const [
    readStrategyFlow,
    { data: storedStrategyFlow, isPending: readIsPending },
  ] = useApiAction.ReadStrategyFlow();

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
    if (canSave) saveStrategyFlow({ ...strategyKey, view: flowView.graph });
  }, [canSave, flowView, saveStrategyFlow, strategyKey]);

  const onClickRun = useCallback<ButtonOnClick>(() => {
    if (canRun) execute(strategyKey);
  }, [canRun, execute, strategyKey]);

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
    if (!flowLoaded) readStrategyFlow(strategyKey);
  }, [flowLoaded, readStrategyFlow, strategyKey]);

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
    } else {
      // Enable Save button when some change on flow happens.
      if (flowChanged) setCanSave(true);
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
      {hasNoBinanceApiConfig && <PleaseConfigureBinanceModal />}

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
            view={flowView?.graph}
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
