import { Button, ButtonOnClick } from "@ggbot2/design";
import { Time } from "@ggbot2/time";
import { FlowViewSerializableGraph } from "flow-view";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FlowMenu } from "../components/FlowMenu.js";
import {
  FlowViewContainer,
  FlowViewContainerRef,
} from "../components/FlowViewContainer.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";

type Props = {
  flowViewContainerRef: FlowViewContainerRef;
  flowViewGraph: FlowViewSerializableGraph | undefined;
  whenUpdatedFlow: Time;
};

export const EditableFlow: FC<Props> = ({
  flowViewContainerRef,
  flowViewGraph,
  whenUpdatedFlow,
}) => {
  const { strategy } = useContext(StrategyContext);

  const [canSave, setCanSave] = useState(false);

  const WRITE = useApi.WriteStrategyFlow();

  const saveIsPending = WRITE.isPending;

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!canSave) return;
    if (!WRITE.canRun) return;
    if (!flowViewGraph) return;
    WRITE.request({
      strategyId: strategy.id,
      strategyKind: strategy.kind,
      view: flowViewGraph,
    });
  }, [WRITE, canSave, strategy, flowViewGraph]);

  useEffect(() => {
    if (whenUpdatedFlow) setCanSave(true);
  }, [whenUpdatedFlow]);

  return (
    <>
      <FlowMenu>
        <Button
          color={canSave ? "primary" : undefined}
          isLoading={saveIsPending}
          onClick={onClickSave}
        >
          <FormattedMessage id="buttonLabel.save" />
        </Button>
      </FlowMenu>

      <FlowViewContainer ref={flowViewContainerRef} />
    </>
  );
};
