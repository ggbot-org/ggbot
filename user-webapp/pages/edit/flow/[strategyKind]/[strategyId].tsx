import { BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readStrategy } from "@ggbot2/database";
import {
  BinanceDflowHost,
  DflowBinanceSymbolInfo,
  getDflowBinanceNodesCatalog,
  isDflowBinanceSymbolInfo,
  nodeTextToViewType,
} from "@ggbot2/dflow";
import { now, truncateTimestamp } from "@ggbot2/time";
import { Button } from "@ggbot2/ui-components";
import { DflowNodesCatalog, DflowNodeUnknown } from "dflow";
import type {
  FlowViewOnChange,
  FlowViewOnChangeDataEdge,
  FlowViewOnChangeDataNode,
} from "flow-view";
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
  binanceSymbols: DflowBinanceSymbolInfo[];
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
    const exchangeInfo = await binance.exchangeInfo();
    const binanceSymbols = exchangeInfo.symbols.filter(
      isDflowBinanceSymbolInfo
    );
    return {
      props: {
        binanceSymbols,
        strategyKey,
        name: strategy.name,
      },
    };
  }

  return {
    props: {
      binanceSymbols: [],
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
  });

  const [flowLoaded, setFlowLoaded] = useState(false);
  const [manageIsLoading, setManageIsLoading] = useState(false);
  const [flowChanged, setFlowChanged] = useState(false);

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
    if (strategyKind === "binance") {
      return getDflowBinanceNodesCatalog({
        symbols: binanceSymbols,
      });
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
      if (!storedStrategyFlow?.view) return;
      if (!flowView) return;
      if (!nodesCatalog) return;
      flowView.nodeTextToType(nodeTextToViewType);
      flowView.addNodeDefinitions({
        nodes: Object.keys(nodesCatalog).map((kind) => ({ name: kind })),
      });
      flowView.loadGraph(storedStrategyFlow.view);
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot load flow");
    }
  }, [flowView, nodesCatalog, setFlowLoaded, storedStrategyFlow, strategyKind]);

  useEffect(() => {
    if (!strategyExecution) return;
    if (strategyExecution.status === "failure")
      toast.error("Strategy execution failure");
  }, [strategyExecution]);

  useEffect(() => {
    if (!flowView) return;
    if (!dflow) return;
    if (!nodesCatalog) return;
    const onChangeFlowView: FlowViewOnChange = (
      { action, data },
      { isLoadGraph, isProgrammatic }
    ) => {
      try {
        if (!flowView) return;
        const isUserInput = !isLoadGraph && !isProgrammatic;

        switch (action) {
          case "CREATE_EDGE": {
            const { id, from, to } = data as FlowViewOnChangeDataEdge;
            dflow.newEdge({ id, source: from, target: to });
            break;
          }

          case "CREATE_NODE": {
            const { text, type, id, ins, outs } =
              data as FlowViewOnChangeDataNode;
            switch (type) {
              case "info":
                break;
              case "json":
                const outputId = outs?.[0]?.id;
                dflow.newNode({
                  id,
                  kind: "data",
                  outputs: [{ id: outputId, data: JSON.parse(text) }],
                });
                break;
              default: {
                const kind = text;
                const node = dflow.newNode({
                  id,
                  kind,
                  inputs: ins?.map(({ id }) => ({ id })),
                  outputs: outs?.map(({ id }) => ({ id })),
                });

                if (node instanceof DflowNodeUnknown) {
                  flowView.node(id).hasError = true;
                  break;
                }

                // Complete node inputs and outputs.

                const NodeClass = nodesCatalog[kind];
                const { inputs = [], outputs = [] } = NodeClass;
                const nodeView = flowView.node(id);

                for (let i = 0; i < inputs.length; i++) {
                  const { name } = inputs[i];

                  if (!nodeView.inputs[i])
                    nodeView.newInput({ id: node.input(0).id });
                  if (typeof name === "string") nodeView.inputs[i].text = name;
                }

                for (let i = 0; i < outputs.length; i++) {
                  const { name } = outputs[i];

                  if (!nodeView.outputs[i])
                    nodeView.newOutput({ id: node.output(0).id });
                  if (typeof name === "string") nodeView.outputs[i].text = name;
                }

                break;
              }
            }
            if (isUserInput) setFlowChanged(true);
            break;
          }

          case "DELETE_NODE": {
            if (isUserInput) setFlowChanged(true);
            break;
          }

          case "UPDATE_NODE": {
            if (isUserInput) setFlowChanged(true);
            break;
          }

          default:
            break;
        }
      } catch (error) {
        switch (action) {
          case "CREATE_EDGE": {
            // Highlight edge view with error color.
            if (typeof data !== "object" || data === null) break;
            const edgeId = data.id;
            if (typeof edgeId !== "string") break;
            try {
              const viewEdge = flowView.edge(edgeId);
              viewEdge.hasError = true;
            } catch (_ignore) {}
            break;
          }

          case "CREATE_NODE": {
            // Highlight node view with error color.
            if (typeof data !== "object" || data === null) break;
            const nodeId = data.id;
            if (typeof nodeId !== "string") break;
            try {
              const viewNode = flowView.node(nodeId);
              viewNode.hasError = true;
            } catch (_ignore) {}
            break;
          }

          default:
            break;
        }
        console.error(error);
      }
    };

    flowView.onChange(onChangeFlowView);
  }, [flowView, dflow, nodesCatalog, setFlowChanged]);

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
      <div className="flex h-full flex-col">
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
