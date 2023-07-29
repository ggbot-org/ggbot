import { Section } from "@ggbot2/design";
import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { EditableFlow } from "../components/EditableFlow.js";
import { ManageStrategy } from "../components/ManageStrategy.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { Tabs } from "../components/Tabs.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const Strategy: FC = () => {
  const { backtesting, flowViewContainerRef, flowViewGraph, whenUpdatedFlow } =
    useStrategyFlow();

  return (
    <>
      <Section>
        <Tabs
          initialTabId="manage"
          tabs={[
            {
              tabId: "manage",
              content: <ManageStrategy />,
            },
            {
              tabId: "backtesting",
              content: <Backtesting {...backtesting} />,
            },
            {
              tabId: "flow",
              content: (
                <EditableFlow
                  flowViewGraph={flowViewGraph}
                  flowViewContainerRef={flowViewContainerRef}
                  whenUpdatedFlow={whenUpdatedFlow}
                />
              ),
            },
          ]}
        />
      </Section>

      <PleasePurchase />
    </>
  );
};
