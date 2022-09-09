import type { FlowView, FlowViewNode, FlowViewNodeTextToType } from "flow-view";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type UseFlowView = (arg: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  nodeTextToViewType: FlowViewNodeTextToType;
}) => FlowView | undefined;

/**
 * @example
 *
 * ```
 * const containerRef = useRef<HTMLDivElement | null>(null);
 * const flowView = useFlowView({ containerRef, nodeTextToViewType });
 *
 * return (
 *   <div ref={containerRef}/>
 * )
 * ```
 */
export const useFlowView: UseFlowView = ({
  containerRef,
  nodeTextToViewType,
}) => {
  const [flowViewInstance, setFlowViewInstance] = useState<
    FlowView | undefined
  >();
  const unmounted = useRef<boolean | null>(null);

  const importFlowView = useCallback(async () => {
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
    setFlowViewInstance(flowView);
  }, [containerRef, flowViewInstance, setFlowViewInstance, unmounted]);

  useEffect(() => {
    importFlowView();
    return () => {
      unmounted.current = true;
      flowViewInstance?.destroy();
    };
  }, [flowViewInstance, importFlowView, unmounted]);

  return flowViewInstance;
};
