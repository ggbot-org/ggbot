import { Column, Columns, InputField } from "@ggbot2/design";
import { FC } from "react";
import { fieldLabel } from "_i18n";
import { StrategyKey, InvalidStrategyKey } from "_routing";

type Props = StrategyKey | InvalidStrategyKey;

export const StrategyKeyFields: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <Columns>
      <Column>
        <InputField label={fieldLabel.strategyKind} readOnly defaultValue={strategyKind} />
      </Column>

      <Column>
        <InputField label={fieldLabel.strategyId} readOnly defaultValue={strategyId} />
      </Column>
    </Columns>
  );
};
