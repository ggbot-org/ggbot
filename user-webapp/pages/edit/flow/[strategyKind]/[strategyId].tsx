import { ErrorAccountItemNotFound, readStrategy } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import {
  StrategyExecution,
  isStrategyExecutionStatus,
  isStrategyFlow,
} from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { Button, ButtonOnClick } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BacktestCheckbox,
  BacktestCheckboxOnChange,
  BacktestController,
  Content,
  LiveCheckbox,
  LiveCheckboxOnChange,
  MemoryController,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationLabel,
  NavigationSettingsIcon,
  StrategyItem,
} from "_components";
import { binance } from "_flow/binance";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import {
  StrategyInfo,
  readSession,
  redirectToAuthenticationPage,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
  redirectToErrorPageStrategyNotOwned,
  route,
  strategyKeyFromRouterParams,
} from "_routing";

type ServerSideProps = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
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
    const binanceSymbols = exchangeInfo.symbols.filter(
      isDflowBinanceSymbolInfo
    );
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

const Page: NextPage<ServerSideProps> = ({
  binanceSymbols,
  name,
  strategyKey,
}) => {
  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: (
          <NavigationBreadcrumbStrategy strategyKey={strategyKey} isLink />
        ),
      },
      {
        content: <NavigationLabel text="edit" />,
        current: true,
      },
    ],
    [strategyKey]
  );

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

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (hasNoBinanceApiConfig) return false;
    if (!isLive) return false;
    if (runIsPending) return false;
    if (saveIsPending) return false;
    return !canSave;
  }, [
    canSave,
    flowLoaded,
    isLive,
    runIsPending,
    hasNoBinanceApiConfig,
    saveIsPending,
  ]);

  const runIsDisabled = useMemo(() => {
    if (runIsPending) return false;
    return !canRun;
  }, [canRun, runIsPending]);

  const saveIsDisabled = useMemo(() => backtesting?.isEnabled, [backtesting]);

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
    <Content
      topbar={
        <Navigation
          breadcrumbs={breadcrumbs}
          icon={<NavigationSettingsIcon />}
        />
      }
      message={hasNoBinanceApiConfig ? <PleaseConfigureBinanceApi /> : null}
    >
      <div className="flex h-full flex-col grow">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <div className="grow">
            <StrategyItem strategyKey={strategyKey}>{name}</StrategyItem>
          </div>

          <menu className="flex h-10 flex-row gap-4 self-end">
            {backtesting && (
              <li>
                <BacktestCheckbox
                  checked={backtesting.isEnabled}
                  onChange={onChangeBacktestingCheckbox}
                />
              </li>
            )}
            <li>
              <LiveCheckbox checked={isLive} onChange={onChangeLiveCheckbox} />
            </li>
            <li>
              <Button
                disabled={runIsDisabled}
                color="danger"
                isSpinning={runIsPending}
                onClick={onClickRun}
              >
                run
              </Button>
            </li>
            <li>
              <Button
                disabled={saveIsDisabled}
                color={canSave ? "primary" : undefined}
                isSpinning={saveIsPending}
                onClick={onClickSave}
              >
                save
              </Button>
            </li>
          </menu>
        </div>

        <BacktestController
          state={backtesting}
          dispatch={backtestingDispatch}
          view={flowView?.graph}
        />

        <div
          className="w-full grow shadow dark:shadow-black"
          ref={flowViewContainerRef}
        />

        <MemoryController />
      </div>
    </Content>
  );
};

const PleaseConfigureBinanceApi = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const goToSettings = useCallback(() => {
    setIsPending(true);
    router.push(route.settingsPage());
  }, [router, setIsPending]);

  return (
    <div className="bg-yellow-100 p-4">
      <div className="max-w-xl flex flex-col gap-4 text-neutral-800">
        <p className="text-base">You cannot run strategies on Binance yet.</p>
        <p className="text-xl">
          Please go to settings page and configure your Binance API.
        </p>
        <menu>
          <li>
            <Button isSpinning={isPending} onClick={goToSettings}>
              Go to Settings
            </Button>
          </li>
        </menu>
      </div>
    </div>
  );
};

export default Page;
