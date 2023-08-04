import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";

import { Schedulings } from "../components/Schedulings.js";
import { StrategyActions } from "../components/StrategyActions.js";
import { StrategyProfits } from "../components/StrategyProfits.js";

export const ManageStrategy: FC = () => (
  <Columns isMultiline>
    <Column
      size={{
        tablet: "full",
        desktop: "half",
        fullhd: "two-fifths",
      }}
    >
      <StrategyActions />
    </Column>

    <Column
      size={{
        tablet: "full",
        desktop: "half",
        fullhd: "two-fifths",
      }}
    >
      <Schedulings />
    </Column>

    <Column size={{ tablet: "full", fullhd: "four-fifths" }}>
      <StrategyProfits numDays={30} />
    </Column>
  </Columns>
);
