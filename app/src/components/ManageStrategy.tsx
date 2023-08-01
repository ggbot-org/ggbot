import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";

import { Schedulings } from "../components/Schedulings.js";
import { StrategyActions } from "../components/StrategyActions.js";
import { StrategyProfits } from "../components/StrategyProfits.js";

export const ManageStrategy: FC = () => (
  <Columns isMultiline>
    <Column size="half">
      <StrategyActions />
    </Column>

    <Column
      size={{
        desktop: "half",
        mobile: "full",
        tablet: "half",
        widescreen: "half",
        fullhd: "one-third",
        // TODO fix this on trunx, for example touch could be undefined
        touch: "full",
      }}
    >
      <Schedulings />
    </Column>

    <Column size="full">
      <StrategyProfits numDays={30} />
    </Column>
  </Columns>
);
