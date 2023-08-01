import { Container } from "@ggbot2/design";
import { FC } from "react";

import { Schedulings } from "../components/Schedulings.js";
import { StrategyActions } from "../components/StrategyActions.js";
import { StrategyProfits } from "../components/StrategyProfits.js";

export const ManageStrategy: FC = () => (
  <Container maxWidth="desktop">
    <StrategyActions />

    <Schedulings />

    <StrategyProfits numDays={30} />
  </Container>
);
