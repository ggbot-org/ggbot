import { Column, Columns, Container } from "@ggbot2/design";
import { FC } from "react";

import { Schedulings } from "../components/Schedulings.js";
import { StrategyActions } from "../components/StrategyActions.js";
import { StrategyProfits } from "../components/StrategyProfits.js";

export const ManageStrategy: FC = () => (
  <Container maxWidth="desktop">
    <Columns>
      <Column>
        <StrategyActions />
      </Column>

      <Column>
        <Schedulings />
      </Column>
    </Columns>

    <Columns>
      <Column>
        <StrategyProfits numDays={30} />
      </Column>
    </Columns>
  </Container>
);
