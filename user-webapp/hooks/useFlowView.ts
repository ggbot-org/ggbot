import { nodeTextToViewType } from "@ggbot2/dflow";
import type { FlowView, FlowViewNode } from "flow-view";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// import { FlowViewNodeInfo } from "_flow/nodes/info";

type UseFlowView = (arg: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
}) => FlowView | undefined;

/**
 * @example
 *
 * ```
 * const containerRef = useRef<HTMLDivElement | null>(null);
 * const flowView = useFlowView({ containerRef });
 *
 * return (
 *   <div ref={containerRef}/>
 * )
 * ```
 */
export const useFlowView: UseFlowView = ({ containerRef }) => {
  const [flowViewInstance, setFlowViewInstance] = useState<
    FlowView | undefined
  >();
  const unmounted = useRef<boolean | null>(null);

  const importFlowView = useCallback(async () => {
    if (unmounted.current || !containerRef.current || flowViewInstance) return;
    const { FlowView } = await import("flow-view");
    const { FlowViewNodeInfo } = await import("../flow/nodes/info");
    const flowView = new FlowView({
      container: containerRef.current,
    });
    flowView.addNodeClass(
      FlowViewNodeInfo.type,
      FlowViewNodeInfo as unknown as FlowViewNode
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
