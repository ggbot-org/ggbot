import {
  BinanceDflowHost,
  DflowBinanceSymbolInfo,
  getDflowBinanceNodesCatalog,
  nodeTextToViewType,
} from "@ggbot2/dflow";
import { now, truncateTimestamp } from "@ggbot2/time";
import {
  DflowHost,
  DflowNodesCatalog,
  DflowNodeUnknown,
  DflowErrorCannotConnectPins,
} from "dflow";
import type {
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
import { StrategyKey } from "_routing";

type UseFlowView = (
  arg: Pick<StrategyKey, "strategyKind"> & {
    binanceSymbols?: DflowBinanceSymbolInfo[];
    containerRef: MutableRefObject<HTMLDivElement | null>;
  }
) => { flowView: FlowView | undefined; flowChanged: boolean };

/**
@example
```ts
const containerRef = useRef<HTMLDivElement | null>(null);

const flowView = useFlowView({
  containerRef,
  strategyKind: "binance",
  binanceSymbols
});

return (
  <div ref={containerRef}/>
)
```
*/
export const useFlowView: UseFlowView = ({
  binanceSymbols,
  containerRef,
  strategyKind,
}) => {
  const [flowViewInstance, setFlowViewInstance] = useState<
    FlowView | undefined
  >();
  const unmounted = useRef<boolean | null>(null);
  const [flowChanged, setFlowChanged] = useState(false);

  const nodesCatalog = useMemo<DflowNodesCatalog | undefined>(() => {
    if (strategyKind === "binance" && binanceSymbols)
      return getDflowBinanceNodesCatalog({ symbols: binanceSymbols });
  }, [binanceSymbols, strategyKind]);

  const dflow = useMemo<DflowHost | undefined>(() => {
    if (strategyKind === "binance" && nodesCatalog) {
      const timestamp = truncateTimestamp({ value: now(), to: "second" });
      return new BinanceDflowHost({ nodesCatalog }, { memory: {}, timestamp });
    }
  }, [nodesCatalog, strategyKind]);

  const importFlowView = useCallback(async () => {
    if (!nodesCatalog || !dflow) return;
    if (unmounted.current || !containerRef.current || flowViewInstance) return;
    const { FlowView } = await import("flow-view");
    const { FlowViewNodeJson, FlowViewNodeInfo } = await import(
      "../flow/nodes/index.js"
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
    flowView.nodeTextToType(nodeTextToViewType);
    flowView.addNodeDefinitions({
      nodes: Object.keys(nodesCatalog)
        .map((kind) => ({ name: kind }))
        .sort(),
    });
    setFlowViewInstance(flowView);

    const onChangeFlowView: FlowViewOnChange = ({ action, data }, info) => {
      try {
        if (!flowView) return;
        const { isLoadGraph, isProgrammatic } = info;
        console.info(action, data, info);
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
                console.log(nodeView.inputs);

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
        console.error(error);
        switch (action) {
          case "CREATE_EDGE": {
            if (typeof data !== "object" || data === null) break;
            const edgeId = data.id;
            if (typeof edgeId !== "string") break;
            try {
              if (error instanceof DflowErrorCannotConnectPins) {
                flowView.deleteEdge(edgeId);
                break;
              }
              const viewEdge = flowView.edge(edgeId);
              viewEdge.hasError = true;
            } catch (_ignore) {}
            break;
          }

          case "CREATE_NODE": {
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
      }
    };
    flowView.onChange(onChangeFlowView);
  }, [
    containerRef,
    flowViewInstance,
    nodesCatalog,
    setFlowChanged,
    setFlowViewInstance,
    unmounted,
  ]);

  useEffect(() => {
    if (!nodesCatalog || !dflow) return;
    importFlowView();
    return () => {
      unmounted.current = true;
      flowViewInstance?.destroy();
    };
  }, [flowViewInstance, dflow, importFlowView, nodesCatalog, unmounted]);

  return { flowView: flowViewInstance, flowChanged };
};
