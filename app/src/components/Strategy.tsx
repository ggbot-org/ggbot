import { Column, Columns, Section } from "@ggbot2/design";
import { FC } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { EditableFlow } from "../components/EditableFlow.js";
import { Schedulings } from "../components/Schedulings.js";
import { StrategyInfo } from "../components/StrategyInfo.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
import { StrategyTabs } from "../components/StrategyTabs.js";
import { useStrategyFlow } from "../hooks/useStrategyFlow.js";

export const Strategy: FC = () => {
  const { backtesting, flowViewContainerRef, flowViewGraph, whenUpdatedFlow } =
    useStrategyFlow();

  return (
    <StrategyTabs
      backtest={<Backtesting {...backtesting} />}
      flow={
        <EditableFlow
          flowViewGraph={flowViewGraph}
          flowViewContainerRef={flowViewContainerRef}
          whenUpdatedFlow={whenUpdatedFlow}
        />
      }
      manage={
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
      }
    />
  );
};
