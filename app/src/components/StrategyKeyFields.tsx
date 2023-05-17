import { fieldLabel } from "_i18n";
import { InvalidStrategyKey, StrategyKey } from "_routing/types";
import { Column, Columns, OutputField } from "@ggbot2/design";
import { FC } from "react";

type Props = StrategyKey | InvalidStrategyKey;

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
