import { Column, Columns, OutputField } from "@ggbot2/design";
import { StrategyKey } from "@ggbot2/models";
import { FC } from "react";

import { fieldLabel } from "../i18n/index.js";

type Props = StrategyKey;

export const StrategyKeyFields: FC<Props> = ({ strategyKind, strategyId }) => (
  <Columns>
    <Column>
      <OutputField label={fieldLabel.strategyKind} value={strategyKind} />
    </Column>

    <Column>
      <OutputField label={fieldLabel.strategyId} value={strategyId} />
    </Column>
  </Columns>
);
