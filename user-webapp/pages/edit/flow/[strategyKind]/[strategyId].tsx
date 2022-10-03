import { BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readStrategy } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Content, Navigation } from "_components";
import { ApiAction, useApiAction, useFlowView } from "_hooks";
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
    const binance = new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
    });
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
  const router = useRouter();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, flowChanged } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind: strategyKey.strategyKind,
  });

  const [flowLoaded, setFlowLoaded] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [hasNoBinanceApiConfig, setHasNoBinanceApiConfig] = useState(false);
  const [manageIsLoading, setManageIsLoading] = useState(false);

  const [strategyKeyToBeExecuted, setStrategyKeyToBeExecuted] =
    useState<ApiAction["EXECUTE_STRATEGY"]["in"]>();

  const [strategyKeyToBeRead, setStrategyKeyToBeRead] =
    useState<ApiAction["READ_STRATEGY_FLOW"]["in"]>();

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const {
    data: strategyExecution,
    isLoading: runIsLoading,
    error: strategyExecutionError,
  } = useApiAction.EXECUTE_STRATEGY(strategyKeyToBeExecuted);

  const { isLoading: saveIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

  const { data: storedStrategyFlow, isLoading: storedStrategyFlowIsLoading } =
    useApiAction.READ_STRATEGY_FLOW(strategyKeyToBeRead);
  console.log("strategyKeyToBeRead", strategyKeyToBeRead);

  const onClickManage = useCallback(() => {
    router.push(route.strategyPage(strategyKey));
    setManageIsLoading(true);
  }, [router, setManageIsLoading, strategyKey]);

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (hasNoBinanceApiConfig) return false;
    if (saveIsLoading) return false;
    return !canSave;
  }, [
    canSave,
    flowLoaded,
    hasNoBinanceApiConfig,
    newStrategyFlow,
    saveIsLoading,
  ]);

  const onClickSave = useCallback(() => {
    if (!flowView) return;
    if (canSave) setNewStrategyFlow({ ...strategyKey, view: flowView.graph });
  }, [canSave, flowView, setNewStrategyFlow, strategyKey]);

  const onClickRun = useCallback(() => {
    if (canRun) setStrategyKeyToBeExecuted(strategyKey);
  }, [canRun, setStrategyKeyToBeExecuted, strategyKey]);

  useEffect(() => {
    if (!strategyExecutionError) return;
    if (hasNoBinanceApiConfig) return;
    if (strategyExecutionError === "MissingBinanceApiConfig") {
      setHasNoBinanceApiConfig(true);
    }
  }, [strategyExecutionError, setHasNoBinanceApiConfig]);

  useEffect(() => {
    if (flowLoaded) setStrategyKeyToBeRead(strategyKey);
  }, [flowLoaded, setStrategyKeyToBeRead, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (storedStrategyFlowIsLoading) return;
      if (storedStrategyFlow?.view) {
        flowView.clearGraph();
        flowView.loadGraph(storedStrategyFlow.view);
      }
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [
    flowView,
    setFlowLoaded,
    storedStrategyFlow,
    storedStrategyFlowIsLoading,
  ]);

  useEffect(() => {
    if (flowChanged) setCanSave(true);
  }, [flowChanged, setCanSave]);

  useEffect(() => {
    if (saveIsLoading) setCanSave(false);
  }, [saveIsLoading, setCanSave]);

  useEffect(() => {
    if (runIsLoading) setStrategyKeyToBeExecuted(undefined);
  }, [runIsLoading, setStrategyKeyToBeExecuted]);

  useEffect(() => {
    if (!strategyExecution) return;
    if (strategyExecution.status === "failure")
      toast.error("Strategy execution failure");
  }, [strategyExecution]);

  useEffect(() => {
    // TODO remove this test
    async function test() {
      const binance = new BinanceExchange({
        baseUrl: BinanceConnector.defaultBaseUrl,
      });
      const info = await binance.exchangeInfo();
      console.log(info);
    }
    test();
  }, []);

  return (
    <Content
      topbar={<Navigation hasSettingsIcon />}
      message={hasNoBinanceApiConfig ? <PleaseConfigureBinanceApi /> : null}
    >
      <div className="flex h-full flex-col grow">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>

          <menu className="flex h-10 flex-row gap-4">
            <Button isLoading={manageIsLoading} onClick={onClickManage}>
              manage
            </Button>
            <Button
              disabled={!canSave}
              isLoading={saveIsLoading}
              onClick={onClickSave}
            >
              save
            </Button>
            <Button
              disabled={!canRun}
              isLoading={runIsLoading}
              onClick={onClickRun}
            >
              run
            </Button>
          </menu>
        </div>

        <div className="w-full grow" ref={flowViewContainerRef}></div>
        <div className="my-2">memory</div>
      </div>
    </Content>
  );
};

const PleaseConfigureBinanceApi = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const goToSettings = useCallback(() => {
    setIsLoading(true);
    router.push(route.settingsPage());
  }, [router, setIsLoading]);

  return (
    <div className="bg-danger-100 p-4">
      <div className="max-w-xl flex flex-col gap-4 text-mono-800">
        <p className="text-base">You cannot run strategies on Binance yet.</p>
        <p className="text-xl">
          Please go to settings page and configure your Binance API.
        </p>
        <menu>
          <Button isLoading={isLoading} onClick={goToSettings}>
            Go to Settings
          </Button>
        </menu>
      </div>
    </div>
  );
};

export default Page;
