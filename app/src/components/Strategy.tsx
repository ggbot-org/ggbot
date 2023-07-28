import { Column, Columns, Section } from "@ggbot2/design";
import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { EditableFlow } from "../components/EditableFlow.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { Schedulings } from "../components/Schedulings.js";
import { StrategyInfo } from "../components/StrategyInfo.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
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
              content: (
                <>
                  <Section>
                    <Columns>
                      <Column>
                        <StrategyInfo />
                      </Column>

                      <Column>
                        <Schedulings />
                      </Column>
                    </Columns>

                    <Columns>
                      <Column>
                        <StrategyProfits />
                      </Column>
                    </Columns>
                  </Section>

                  <Section>
                    <DeleteStrategy />
                  </Section>
                </>
              ),
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
