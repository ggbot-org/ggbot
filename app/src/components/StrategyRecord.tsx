import { Column, Columns } from "@ggbot2/design";
import { Strategy } from "@ggbot2/models";
import { FC } from "react";

import { StrategyId } from "../components/StrategyId.js";
import { StrategyName } from "../components/StrategyName.js";
import { WhenCreated } from "../components/WhenCreated.js";

type Props = { strategy: Strategy };

export const StrategyRecord: FC<Props> = ({ strategy }) => (
  <>
    <Columns>
      <Column>
        <StrategyName readOnly value={strategy.name} />
      </Column>
    </Columns>

    <Columns>
      <Column>
        <StrategyId value={strategy.id} />
      </Column>

      <Column>
        <WhenCreated value={strategy.whenCreated} />
      </Column>
    </Columns>
  </>
);
