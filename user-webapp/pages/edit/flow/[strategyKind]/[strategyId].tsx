import { BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readStrategy } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Content, Navigation } from "_components";
import { useApiAction, useFlowView } from "_hooks";
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
  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, flowChanged } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind: strategyKey.strategyKind,
  });

  const strategyHref = useMemo(
    () => route.strategyPage(strategyKey),
    [strategyKey]
  );

  const [flowLoaded, setFlowLoaded] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [hasNoBinanceApiConfig, setHasNoBinanceApiConfig] = useState(false);

  const [
    execute,
    {
      data: strategyExecution,
      isPending: runIsPending,
      error: strategyExecutionError,
    },
  ] = useApiAction.EXECUTE_STRATEGY();

  const [save, { isPending: saveIsPending }] =
    useApiAction.WRITE_STRATEGY_FLOW();

  const [read, { data: storedStrategyFlow, isPending: readIsPending }] =
    useApiAction.READ_STRATEGY_FLOW();

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (hasNoBinanceApiConfig) return false;
    if (runIsPending) return false;
    if (saveIsPending) return false;
    return !canSave;
  }, [canSave, flowLoaded, runIsPending, hasNoBinanceApiConfig, saveIsPending]);

  const onClickSave = useCallback(() => {
    if (!flowView) return;
    if (canSave) save({ data: { ...strategyKey, view: flowView.graph } });
  }, [canSave, flowView, save, strategyKey]);

  const onClickRun = useCallback(() => {
    if (canRun) execute({ data: strategyKey });
  }, [canRun, execute, strategyKey]);

  useEffect(() => {
    if (!strategyExecutionError) return;
    if (hasNoBinanceApiConfig) return;
    if (strategyExecutionError === "MissingBinanceApiConfig") {
      setHasNoBinanceApiConfig(true);
    }
  }, [strategyExecutionError, hasNoBinanceApiConfig, setHasNoBinanceApiConfig]);

  useEffect(() => {
    if (flowLoaded) read({ data: strategyKey });
  }, [flowLoaded, read, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (readIsPending) return;
      if (storedStrategyFlow?.view) {
        flowView.clearGraph();
        flowView.loadGraph(storedStrategyFlow.view);
      }
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, readIsPending]);

  useEffect(() => {
    if (flowChanged) setCanSave(true);
  }, [flowChanged, setCanSave]);

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
      topbar={<Navigation brandLinksToHomepage hasSettingsIcon />}
      message={hasNoBinanceApiConfig ? <PleaseConfigureBinanceApi /> : null}
    >
      <div className="flex h-full flex-col grow">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <Link href={strategyHref}>
            <div className="cursor-pointer rounded grow p-2 hover:text-primary-900 hover:bg-primary-100 transition-all delay-200">
              {name}
            </div>
          </Link>

          <menu className="flex h-10 flex-row gap-4">
            <Button
              disabled={!canSave}
              isSpinning={saveIsPending}
              onClick={onClickSave}
            >
              save
            </Button>
            <Button
              disabled={!canRun}
              isSpinning={runIsPending}
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
  const [isPending, setIsPending] = useState(false);

  const goToSettings = useCallback(() => {
    setIsPending(true);
    router.push(route.settingsPage());
  }, [router, setIsPending]);

  return (
    <div className="bg-danger-100 p-4">
      <div className="max-w-xl flex flex-col gap-4 text-mono-800">
        <p className="text-base">You cannot run strategies on Binance yet.</p>
        <p className="text-xl">
          Please go to settings page and configure your Binance API.
        </p>
        <menu>
          <Button isSpinning={isPending} onClick={goToSettings}>
            Go to Settings
          </Button>
        </menu>
      </div>
    </div>
  );
};

export default Page;
