import {
  BinanceDflowExecutor,
  BinanceDflowHost,
  nodeTextToViewType,
  parsePercentage,
} from "@ggbot2/dflow";
import { UpdateTime } from "@ggbot2/models";
import { now, Time, truncateTime } from "@ggbot2/time";
import {
  DflowErrorCannotConnectPins,
  DflowHost,
  DflowNodeUnknown,
} from "dflow";
import {
  FlowView,
  FlowViewNode,
  FlowViewOnChange,
  FlowViewOnChangeDataEdge,
  FlowViewOnChangeDataNode,
} from "flow-view";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BinanceDflowClient } from "../flow/binance.js";
import { StrategyKey } from "../routing/types.js";
import { useNodesCatalog, UseNodesCatalogArg } from "./useNodesCatalog.js";

type UseFlowView = (
  arg: Pick<StrategyKey, "strategyKind"> &
    Pick<UseNodesCatalogArg, "binanceSymbols"> & {
      containerRef: MutableRefObject<HTMLDivElement | null>;
    }
) => { flowView: FlowView | undefined } & Partial<UpdateTime>;

/**
 * @example
 *
 * ```ts
 * const containerRef = useRef<HTMLDivElement | null>(null);
 *
 * const { flowView, whenUpdated } = useFlowView({
 *   containerRef,
 *   strategyKind: "binance",
 *   binanceSymbols,
 * });
 *
 * return <div ref={containerRef} />;
 * ```
 */
export const useFlowView: UseFlowView = ({
  binanceSymbols,
  containerRef,
  strategyKind,
}) => {
  const flowViewRef = useRef<FlowView>();
  const [whenUpdated, setWhenUpdated] = useState<Time | undefined>();

  const nodesCatalog = useNodesCatalog({ strategyKind, binanceSymbols });

  const time = truncateTime(now()).to.minute();

  const dflow = useMemo<DflowHost | undefined>(() => {
    if (strategyKind !== "binance") return;
    if (!nodesCatalog) return;
    const binance = new BinanceDflowClient({
      balances: [],
      time,
    });
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { binance, input: {}, memory: {}, time }
    );
    return dflow;
  }, [nodesCatalog, strategyKind, time]);

  const binanceExecutor = useMemo<BinanceDflowExecutor | undefined>(() => {
    if (strategyKind !== "binance") return;
    if (!binanceSymbols) return;
    if (!nodesCatalog) return;
    const binance = new BinanceDflowClient({
      balances: [],
      time,
    });
    const executor = new BinanceDflowExecutor(
      binance,
      binanceSymbols,
      nodesCatalog
    );
    return executor;
  }, [binanceSymbols, nodesCatalog, strategyKind, time]);

  const importFlowView = useCallback(async () => {
    if (!containerRef.current) return;
    if (!nodesCatalog || !dflow) return;
    const { FlowView } = await import("flow-view");
    const { FlowViewNodeInfo, FlowViewNodeJson, FlowViewNodePercentage } =
      await import("../flow/nodes/index.js");
    const flowView = new FlowView(containerRef.current);
    flowView.addNodeClass(
      FlowViewNodeInfo.type,
      FlowViewNodeInfo as unknown as FlowViewNode
    );
    flowView.addNodeClass(
      FlowViewNodeJson.type,
      FlowViewNodeJson as unknown as FlowViewNode
    );
    flowView.addNodeClass(
      FlowViewNodePercentage.type,
      FlowViewNodePercentage as unknown as FlowViewNode
    );
    flowView.nodeTextToType((text) => nodeTextToViewType(text));
    flowView.addNodeDefinitions({
      nodes: Object.keys(nodesCatalog)
        .map((kind) => ({ name: kind }))
        .sort(),
    });
    flowViewRef.current = flowView;

    const onChangeFlowView: FlowViewOnChange = ({ action, data }, info) => {
      try {
        if (!flowView) return;
        const { isLoadGraph, isProgrammatic } = info;
        const isUserInput = !isLoadGraph && !isProgrammatic;

        switch (action) {
          case "CREATE_EDGE": {
            const { id, from, to } = data as FlowViewOnChangeDataEdge;
            dflow.newEdge({ id, source: from, target: to });
            if (isUserInput) setWhenUpdated(now());
            break;
          }

          case "CREATE_NODE": {
            const { text, type, id, ins, outs } =
              data as FlowViewOnChangeDataNode;
            switch (type) {
              case "info":
                break;
              case "json": {
                const outputId = outs?.[0]?.id;
                dflow.newNode({
                  id,
                  kind: "data",
                  outputs: [{ id: outputId, data: JSON.parse(text) }],
                });
                break;
              }
              case "perc": {
                const outputId = outs?.[0]?.id;
                dflow.newNode({
                  id,
                  kind: "data",
                  outputs: [{ id: outputId, data: parsePercentage(text) }],
                });
                break;
              }
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
                  const name = inputs[i].name;
                  if (nodeView.inputs[i]) {
                    nodeView.inputs[i].name = name;
                    nodeView.inputs[i].text = name;
                  } else {
                    nodeView.newInput({
                      id: node.input(i).id,
                      name,
                    });
                  }
                }

                for (let i = 0; i < outputs.length; i++) {
                  const name = outputs[i].name;
                  if (nodeView.outputs[i]) {
                    nodeView.outputs[i].name = name;
                    nodeView.outputs[i].text = name;
                  } else {
                    nodeView.newOutput({
                      id: node.output(i).id,
                      name,
                    });
                  }
                }

                break;
              }
            }
            if (isUserInput) setWhenUpdated(now());
            break;
          }

          case "DELETE_EDGE": {
            if (isUserInput) setWhenUpdated(now());
            break;
          }

          case "DELETE_NODE": {
            if (isUserInput) setWhenUpdated(now());
            break;
          }

          case "UPDATE_NODE": {
            if (isUserInput) setWhenUpdated(now());
            break;
          }

          default:
            break;
        }
      } catch (error) {
        console.error(error);

        switch (action) {
          case "CREATE_EDGE": {
            if (typeof data !== "object" || data === null) break;
            const edgeId = data.id;
            if (typeof edgeId !== "string") break;
            if (error instanceof DflowErrorCannotConnectPins) {
              flowView.deleteEdge(edgeId);
              break;
            }
            const viewEdge = flowView.edge(edgeId);
            viewEdge.hasError = true;
            break;
          }

          case "CREATE_NODE": {
            if (typeof data !== "object" || data === null) break;
            const nodeId = data.id;
            if (typeof nodeId !== "string") break;
            const viewNode = flowView.node(nodeId);
            viewNode.hasError = true;
            break;
          }

          default:
            break;
        }
      }
    };
    flowView.onChange(onChangeFlowView);
  }, [containerRef, dflow, flowViewRef, nodesCatalog, setWhenUpdated]);

  useEffect(() => {
    if (!whenUpdated) return;
    (async () => {
      const flowView = flowViewRef.current;
      if (!flowView) return;
      switch (strategyKind) {
        case "binance": {
          if (!binanceExecutor) return;
          await binanceExecutor.run(
            { input: {}, memory: {}, time: truncateTime(now()).to.minute() },
            flowView.graph
          );
          // TODO update flow with mocked execution if is not "live"
          break;
        }
        default:
          break;
      }
    })();
  }, [binanceExecutor, flowViewRef, strategyKind, whenUpdated]);

  useEffect(() => {
    if (!nodesCatalog || !dflow) return;
    importFlowView();
    return () => {
      flowViewRef.current?.destroy();
    };
  }, [dflow, importFlowView, nodesCatalog]);

  return { flowView: flowViewRef.current, whenUpdated };
};
