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
  const [manageIsLoading, setManageIsLoading] = useState(false);

  const [strategyKeyToBeExecuted, setStrategyKeyToBeExecuted] =
    useState<ApiAction["EXECUTE_STRATEGY"]["in"]>();

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const { data: strategyExecution, isLoading: runIsLoading } =
    useApiAction.EXECUTE_STRATEGY(strategyKeyToBeExecuted);

  const { data: saveData, isLoading: saveIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

  const { data: storedStrategyFlow, isLoading: storedStrategyFlowIsLoading } =
    useApiAction.READ_STRATEGY_FLOW(flowView ? strategyKey : undefined);

  const onClickManage = useCallback(() => {
    router.push(route.strategyPage(strategyKey));
    setManageIsLoading(true);
  }, [router, setManageIsLoading, strategyKey]);

  const onClickSave = useCallback(() => {
    if (!flowLoaded) return;
    if (manageIsLoading) return;
    if (runIsLoading) return;
    if (saveIsLoading) return;
    if (!flowView) return;
    setNewStrategyFlow({ ...strategyKey, view: flowView.graph });
  }, [
    flowView,
    flowLoaded,
    manageIsLoading,
    runIsLoading,
    setNewStrategyFlow,
    strategyKey,
    saveIsLoading,
  ]);

  const onClickRun = useCallback(() => {
    if (!flowLoaded) return;
    if (manageIsLoading) return;
    if (runIsLoading) return;
    if (saveIsLoading) return;
    if (typeof newStrategyFlow !== "undefined") return;
    setStrategyKeyToBeExecuted(strategyKey);
  }, [
    flowLoaded,
    manageIsLoading,
    newStrategyFlow,
    runIsLoading,
    saveIsLoading,
    setStrategyKeyToBeExecuted,
    strategyKey,
  ]);

  const canRun = useMemo(() => {
    if (!flowLoaded) return false;
    if (typeof newStrategyFlow !== "undefined") return false;
    return true;
  }, [flowLoaded, newStrategyFlow]);

  const canSave = useMemo(() => {
    if (!flowLoaded) return false;
    if (saveIsLoading) return false;
    return flowChanged;
  }, [flowChanged, flowLoaded, saveIsLoading]);

  useEffect(() => {
    if (!saveData) return;
  }, [saveData, setNewStrategyFlow]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (storedStrategyFlowIsLoading) return;
      if (storedStrategyFlow?.view) flowView.loadGraph(storedStrategyFlow.view);
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
    <Content topbar={<Navigation hasSettingsIcon />}>
      <div className="flex h-full flex-col grow">
        <div className="flex flex-row justify-between gap-4 py-3 md:flex-row md:items-center">
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

export default Page;
