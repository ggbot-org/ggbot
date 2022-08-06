import type { FlowView } from "flow-view";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [flowView, setFlowView] = useState<FlowView | undefined>();
  const unmounted = useRef<boolean | null>(null);

  const importFlowView = useCallback(async () => {
    if (unmounted.current || !containerRef.current || flowView) return;
    const { FlowView } = await import("flow-view");
    setFlowView(
      new FlowView({
        container: containerRef.current,
      })
    );
  }, [containerRef, flowView, setFlowView, unmounted]);

  useEffect(() => {
    importFlowView();
    return () => {
      unmounted.current = true;
      flowView?.destroy();
    };
  }, [flowView, importFlowView, unmounted]);

  return flowView;
};
