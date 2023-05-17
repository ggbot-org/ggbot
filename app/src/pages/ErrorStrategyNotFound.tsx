import { StrategyKeyFields } from "_components/StrategyKeyFields";
import { OneSectionLayout } from "_layouts/OneSection";
import { StrategyKey } from "_routing/types";
import { Message } from "@ggbot2/design";
import { FC } from "react";

type Props = StrategyKey;

export const ErrorStrategyNotFoundPage: FC<Props> = (strategyKey) => (
  <OneSectionLayout>
    <Message header="Strategy not found">
      <StrategyKeyFields {...strategyKey} />
    </Message>
  </OneSectionLayout>
);
