import { Column, Columns, Section, Tabs } from "@ggbot2/design";
import { FC, useState } from "react";
import { useIntl } from "react-intl";

import { Backtesting } from "../components/Backtesting.js";
import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { EditableFlow } from "../components/EditableFlow.js";
import { Schedulings } from "../components/Schedulings.js";
import { StrategyInfo } from "../components/StrategyInfo.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const Strategy: FC = () => {
  const { formatMessage } = useIntl();

  const { backtesting, flowViewContainerRef, flowViewGraph, whenUpdatedFlow } =
    useStrategyFlow();

  const [activeTabId, setActiveTabId] = useState("manage");

  return (
    <Tabs
      activeTabId={activeTabId}
      setActiveTabId={setActiveTabId}
      tabs={[
        {
          tabId: "manage",
          selector: formatMessage({ id: "tabLabel.manage" }),
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
          tabId: "backtest",
          selector: formatMessage({ id: "tabLabel.backtest" }),
          content: <Backtesting {...backtesting} />,
        },
        {
          tabId: "flow",
          selector: formatMessage({ id: "tabLabel.flow" }),
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
  );
};
