import { readSession } from "@ggbot2/cookies";
import { ErrorAccountItemNotFound, readStrategy } from "@ggbot2/database";
import { Button, Buttons, ButtonOnClick } from "@ggbot2/design";
import { DflowBinanceSymbolInfo, isDflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { StrategyExecution, isStrategyExecutionStatus, isStrategyFlow } from "@ggbot2/models";
import { isTime } from "@ggbot2/time";
import { isMaybeObject } from "@ggbot2/type-utils";
import { DflowExecutionNodeInfo } from "dflow";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BacktestCheckbox,
  BacktestCheckboxOnChange,
  BacktestController,
  LiveCheckbox,
  LiveCheckboxOnChange,
  MemoryController,
  Navigation,
  Page,
  PleaseConfigureBinanceApi,
  StrategyItem,
  StrategyExecutionLog,
} from "_components";
import { binance } from "_flow/binance";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import {
  StrategyInfo,
  redirectToAuthenticationPage,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
  redirectToErrorPageStrategyNotOwned,
  strategyKeyFromRouterParams,
} from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const session = readSession(req.cookies);
  if (!session) return redirectToAuthenticationPage();

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);
  const { name } = strategy;

  const accountIsOwner = session.accountId === strategy.accountId;
  if (!accountIsOwner) return redirectToErrorPageStrategyNotOwned(strategyKey);

  const { strategyKind } = strategyKey;

  if (strategyKind === "binance") {
    const exchangeInfo = await binance.exchangeInfo();
    const binanceSymbols = exchangeInfo.symbols.filter(isDflowBinanceSymbolInfo);
    return {
      props: {
        binanceSymbols,
        strategyKey,
        name,
      },
    };
  }

  return {
    props: {
      strategyKey,
      name,
    },
  };
};

export const EditStrategyFlow: FC<Props> = ({ binanceSymbols, name, strategyKey }) => {
  const [flowChanged, setFlowChanged] = useState(false);
  const [flowLoaded, setFlowLoaded] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hasNoBinanceApiConfig, setHasNoBinanceApiConfig] = useState(false);

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

  const [execute, { data: strategyExecution, isPending: runIsPending, error: strategyExecutionError }] =
    useApiAction.ExecuteStrategy();

  const [saveStrategyFlow, { isPending: saveIsPending }] = useApiAction.WriteStrategyFlow();

  const [readStrategyFlow, { data: storedStrategyFlow, isPending: readIsPending }] =
    useApiAction.ReadStrategyFlow();

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (hasNoBinanceApiConfig) return false;
    if (!isLive) return false;
    if (runIsPending) return false;
    if (saveIsPending) return false;
    return !canSave;
  }, [canSave, flowLoaded, isLive, runIsPending, hasNoBinanceApiConfig, saveIsPending]);

  const runIsDisabled = useMemo(() => {
    if (runIsPending) return false;
    return !canRun;
  }, [canRun, runIsPending]);

  const saveIsDisabled = useMemo(() => backtesting?.isEnabled, [backtesting]);

  const { executionStatus, executionSteps, executionWhenUpdated } = useMemo(() => {
    if (!isMaybeObject<StrategyExecution>(strategyExecution))
      return {
        executionWhenUpdated: undefined,
        executionSteps: undefined,
        executionStatus: undefined,
      };
    const { status, steps, whenUpdated } = strategyExecution;
    const executionStatus = isStrategyExecutionStatus(status) ? status : undefined;
    const executionWhenUpdated = isTime(whenUpdated) ? whenUpdated : undefined;
    return {
      executionSteps: steps as DflowExecutionNodeInfo[],
      executionStatus,
      executionWhenUpdated,
    };
  }, [strategyExecution]);

  const onChangeBacktestingCheckbox = useCallback<BacktestCheckboxOnChange>(
    (event) => {
      const wantBacktesting = event.target.checked;
      backtestingDispatch({ type: "TOGGLE" });
      if (wantBacktesting) setIsLive(false);
    },
    [backtestingDispatch, setIsLive]
  );

  const onChangeLiveCheckbox = useCallback<LiveCheckboxOnChange>(
    (event) => {
      const isLive = event.target.checked;
      setIsLive(isLive);
      if (isLive) backtestingDispatch({ type: "DISABLE" });
    },
    [backtestingDispatch, setIsLive]
  );

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
    if (status === "failure") toast.error("Strategy execution failure");
  }, [strategyExecution]);

  return (
    <Page topbar={<Navigation />}>
      {hasNoBinanceApiConfig ? <PleaseConfigureBinanceApi /> : null}
      <div>
        <StrategyItem strategyKey={strategyKey}>{name}</StrategyItem>

        {backtesting && (
          <BacktestCheckbox checked={backtesting.isEnabled} onChange={onChangeBacktestingCheckbox} />
        )}
        <LiveCheckbox checked={isLive} onChange={onChangeLiveCheckbox} />

        <Buttons>
          <Button disabled={runIsDisabled} color="danger" isLoading={runIsPending} onClick={onClickRun}>
            Run
          </Button>

          <Button
            disabled={saveIsDisabled}
            color={canSave ? "primary" : undefined}
            isLoading={saveIsPending}
            onClick={onClickSave}
          >
            Save
          </Button>
        </Buttons>
      </div>

      <BacktestController state={backtesting} dispatch={backtestingDispatch} view={flowView?.graph} />

      <div ref={flowViewContainerRef} />

      <MemoryController />

      <StrategyExecutionLog
        status={executionStatus}
        steps={executionSteps}
        whenUpdated={executionWhenUpdated}
      />
    </Page>
  );
};
