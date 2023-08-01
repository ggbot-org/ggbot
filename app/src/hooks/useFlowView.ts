import { BinanceDflowHost, parsePercentage } from "@ggbot2/dflow";
import { now, Time, truncateTime } from "@ggbot2/time";
import {
  DflowErrorCannotConnectPins,
  DflowNodesCatalog,
  DflowNodeUnknown,
} from "dflow";
import {
  FlowView,
  FlowViewOnChange,
  FlowViewOnChangeDataEdge,
  FlowViewOnChangeDataNode,
} from "flow-view";
import { useCallback, useContext, useMemo, useState } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { BinanceDflowClient } from "../flow/binance.js";
import { initializeFlowView } from "../flow/initializeFlowView.js";
import { useNodesCatalog } from "../hooks/useNodesCatalog.js";

export const useFlowView = (container: HTMLDivElement | null) => {
  const {
    strategy: { kind: strategyKind },
  } = useContext(StrategyContext);

  const [whenUpdated, setWhenUpdated] = useState<Time>(0);

  const nodesCatalog = useNodesCatalog();

  const initializeBinanceFlowView = useCallback(
    (container: HTMLDivElement, nodesCatalog: DflowNodesCatalog): FlowView => {
      const time = truncateTime(now()).to.minute();
      const binance = new BinanceDflowClient({
        balances: [],
        time,
      });
      const dflow = new BinanceDflowHost(
        { nodesCatalog },
        { binance, input: {}, memory: {}, time }
      );

      const flowView = initializeFlowView(container, nodesCatalog);

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

      return flowView;
    },
    []
  );

  // Initialize.
  const flowView = useMemo(() => {
    if (!nodesCatalog) return;
    if (!container) return;
    if (strategyKind === "binance")
      return initializeBinanceFlowView(container, nodesCatalog);
  }, [container, initializeBinanceFlowView, nodesCatalog, strategyKind]);

  // Dispose.
  // TODO
  // useEffect(() => flowView?.destroy, [flowView]);

  return { flowView, whenUpdatedFlow: whenUpdated };
};
