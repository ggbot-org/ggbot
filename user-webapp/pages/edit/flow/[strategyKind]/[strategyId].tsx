import {
  BinanceConnector,
  BinanceExchange,
  BinanceExchangeInfo,
} from "@ggbot2/binance";
import { readStrategy } from "@ggbot2/database";
import {
  BinanceDflowHost,
  getDflowBinanceNodesCatalog,
  nodeTextToViewType,
} from "@ggbot2/dflow";
import { now, truncateTimestamp } from "@ggbot2/time";
import { Button } from "@ggbot2/ui-components";
import type { DflowNodesCatalog } from "dflow";
import type {
  FlowViewOnChange,
  FlowViewOnChangeDataEdge,
  FlowViewOnChangeDataNode,
} from "flow-view";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Content } from "_components";
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
  binanceSymbols?: BinanceExchangeInfo["symbols"];
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

  const accountIsOwner = session.accountId === strategy.accountId;
  if (!accountIsOwner) return redirectToErrorPageStrategyNotOwned(strategyKey);

  const { strategyKind } = strategyKey;

  if (strategyKind === "binance") {
    const binance = new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
    });
    const { symbols } = await binance.exchangeInfo();
    return {
      props: {
        binanceSymbols: symbols,
        strategyKey,
        name: strategy.name,
      },
    };
  }

  return {
    props: {
      strategyKey,
      name: strategy.name,
    },
  };
};

const Page: NextPage<ServerSideProps> = ({
  binanceSymbols = [],
  name,
  strategyKey,
}) => {
  const router = useRouter();

  const { strategyKind } = strategyKey;

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const flowView = useFlowView({
    containerRef: flowViewContainerRef,
    nodeTextToViewType,
  });

  const [flowLoaded, setFlowLoaded] = useState(false);

  const [manageIsLoading, setManageIsLoading] = useState(false);

  const [strategyKeyToBeExecuted, setStrategyKeyToBeExecuted] =
    useState<ApiAction["EXECUTE_STRATEGY"]["in"]>();

  const [newStrategyFlow, setNewStrategyFlow] =
    useState<ApiAction["WRITE_STRATEGY_FLOW"]["in"]>();

  const { data: storedStrategyFlow } = useApiAction.READ_STRATEGY_FLOW(
    flowView ? strategyKey : undefined
  );

  const { data: strategyExecution, isLoading: runIsLoading } =
    useApiAction.EXECUTE_STRATEGY(strategyKeyToBeExecuted);

  const { data: saveData, isLoading: saveIsLoading } =
    useApiAction.WRITE_STRATEGY_FLOW(newStrategyFlow);

  const nodesCatalog = useMemo<DflowNodesCatalog | undefined>(() => {
    if (strategyKind === "binance" && binanceSymbols.length > 0) {
      const nodesCatalog = getDflowBinanceNodesCatalog({
        symbols: binanceSymbols,
      });
      return nodesCatalog;
    }
  }, [binanceSymbols, strategyKind]);

  const dflow = useMemo(() => {
    if (strategyKind === "binance" && nodesCatalog) {
      const timestamp = truncateTimestamp({ value: now(), to: "second" });
      const dflow = new BinanceDflowHost(
        { nodesCatalog },
        { memory: {}, timestamp }
      );
      return dflow;
    }
  }, [nodesCatalog, strategyKind]);

  const onChangeFlowView = useCallback<FlowViewOnChange>(
    ({ action, data }, info) => {
      try {
        if (!dflow) return;
        if (!flowView) return;
        switch (action) {
          case "CREATE_EDGE": {
            const { id, from, to } = data as FlowViewOnChangeDataEdge;
            dflow.newEdge({ id, source: from, target: to });
            break;
          }

          case "CREATE_NODE": {
            const { text, type, id } = data as FlowViewOnChangeDataNode;
            switch (type) {
              case "info":
                break;
              default: {
                dflow.newNode({ id, kind: text });
              }
            }
            break;
          }

          default:
            console.info(action, data, info);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dflow, flowView]
  );

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
    return true;
  }, [flowLoaded]);

  useEffect(() => {
    if (!saveData) return;
  }, [saveData, setNewStrategyFlow]);

  useEffect(() => {
    try {
      if (!storedStrategyFlow?.view) return;
      if (!flowView) return;
      if (!nodesCatalog) return;
      flowView.loadGraph(storedStrategyFlow.view);
      flowView.addNodeDefinitions({
        nodes: Object.keys(nodesCatalog).map((kind) => ({ name: kind })),
      });
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [flowView, nodesCatalog, setFlowLoaded, storedStrategyFlow]);

  useEffect(() => {
    if (!strategyExecution) return;
    if (strategyExecution.status === "failure")
      toast.error("Strategy execution failure");
  }, [strategyExecution]);

  useEffect(() => {
    if (!flowView) return;
    flowView.onChange(onChangeFlowView);
  }, [flowView, onChangeFlowView]);

  useEffect(() => {
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
    <Content>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between py-3 gap-4 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>

          <menu className="flex flex-row h-10 gap-4">
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
