import { Column, Columns, Section } from "@ggbot2/design";
import { FC } from "react";

import { Schedulings } from "../components/Schedulings.js";
import { StrategyActions } from "../components/StrategyActions.js";
import { StrategyProfits } from "../components/StrategyProfits.js";

export const ManageStrategy: FC = () => (
  <>
    <Section>
      <Columns>
        <Column>
          <StrategyActions />
        </Column>

        <Column>
          <Schedulings />
        </Column>
      </Columns>
    </Section>

    <Section>
      <StrategyProfits numDays={30} />
    </Section>
  </>
);
