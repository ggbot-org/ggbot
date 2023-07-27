import {
  BinanceDflowHost,
  nodeTextToViewType,
  parsePercentage,
} from "@ggbot2/dflow";
import { now, Time, truncateTime } from "@ggbot2/time";
import {
  DflowErrorCannotConnectPins,
  DflowNodesCatalog,
  DflowNodeUnknown,
} from "dflow";
import {
  FlowView,
  FlowViewNode,
  FlowViewOnChange,
  FlowViewOnChangeDataEdge,
  FlowViewOnChangeDataNode,
} from "flow-view";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { FlowViewContainerRef } from "../components/FlowViewContainer.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { BinanceDflowClient } from "../flow/binance.js";
import {
  FlowViewNodeInfo,
  FlowViewNodeJson,
  FlowViewNodePercentage,
} from "../flow/nodes/index.js";
import { useNodesCatalog } from "../hooks/useNodesCatalog.js";

export const useFlowView = (containerRef: FlowViewContainerRef) => {
  const {
    strategy: { kind: strategyKind },
  } = useContext(StrategyContext);

  const flowViewRef = useRef<FlowView>();
  const [whenUpdated, setWhenUpdated] = useState<Time>(0);

  const nodesCatalog = useNodesCatalog();

  const initializeBinanceFlowView = useCallback(
    (nodesCatalog: DflowNodesCatalog) => {
      if (!containerRef.current) return;

      const time = truncateTime(now()).to.minute();
      const binance = new BinanceDflowClient({
        balances: [],
        time,
      });
      const dflow = new BinanceDflowHost(
        { nodesCatalog },
        { binance, input: {}, memory: {}, time }
      );

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
                    outputs: [
                      {
                        data: JSON.parse(text),
                        id: outputId,
                      },
                    ],
                  });
                  break;
                }
                case "perc": {
                  const outputId = outs?.[0]?.id;
                  dflow.newNode({
                    id,
                    kind: "data",
                    outputs: [
                      {
                        data: parsePercentage(text),
                        id: outputId,
                      },
                    ],
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
    },
    [containerRef, flowViewRef, setWhenUpdated]
  );

  useEffect(() => {
    if (!nodesCatalog) return;
    if (strategyKind === "binance") initializeBinanceFlowView(nodesCatalog);
    return () => {
      flowViewRef.current?.destroy();
    };
  }, [initializeBinanceFlowView, nodesCatalog, strategyKind]);

  return { flowView: flowViewRef.current, whenUpdatedFlow: whenUpdated };
};
