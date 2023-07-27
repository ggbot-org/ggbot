// TODO remove this
import { ButtonOnClick } from "@ggbot2/design";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { EditStrategyTopbar } from "../components/EditStrategyTopbar.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useFlowView } from "../hooks/useFlowView.js";

export const EditStrategyFlow: FC = () => {
  const { strategy, strategyFlow: storedStrategyFlow } =
    useContext(StrategyContext);

  const [canSave, setCanSave] = useState(false);
  const [flowChanged, setFlowChanged] = useState(false);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView, whenUpdated: whenUpdatedFlow } = useFlowView({
    containerRef: flowViewContainerRef,
    strategyKind: strategy.kind,
  });

  const WRITE = useApi.WriteStrategyFlow();

  const saveIsPending = WRITE.isPending;

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!flowView) return;
    if (!canSave) return;
    if (WRITE.canRun)
      WRITE.request({
        strategyId: strategy.id,
        strategyKind: strategy.kind,
        view: flowView.graph,
      });
  }, [WRITE, canSave, flowView, strategy]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (storedStrategyFlow === undefined) return;
      if (storedStrategyFlow === null) {
        // TODO set Welcome flow
        return;
      }
      flowView.clearGraph();
      flowView.loadGraph(storedStrategyFlow.view);
    } catch (error) {
      // TODO show error to user
      console.error(error);
    }
  }, [flowView, storedStrategyFlow]);

  useEffect(() => {
    if (whenUpdatedFlow) setFlowChanged(true);
  }, [setFlowChanged, whenUpdatedFlow]);

  useEffect(() => {
    // Disable Save button once saving changes start.
    if (saveIsPending) {
      setCanSave(false);
      setFlowChanged(false);
    } else if (flowChanged) {
      // Enable Save button when some change on flow happens.
      setCanSave(true);
    }
  }, [flowChanged, saveIsPending, setCanSave]);

  return (
    <EditStrategyTopbar
      canSave={canSave}
      onClickSave={onClickSave}
      saveIsPending={saveIsPending}
    />
  );
};
