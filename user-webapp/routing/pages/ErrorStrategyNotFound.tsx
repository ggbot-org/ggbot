import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKeyFields } from "_components";
import { OneSectionLayout } from "_layouts";
import { StrategyKey } from "_routing";

type Props = StrategyKey;

export const ErrorStrategyNotFoundPage: FC<Props> = (strategyKey) => {
  return (
    <OneSectionLayout>
      <Message header="Strategy not found">
        <StrategyKeyFields {...strategyKey} />
      </Message>
    </OneSectionLayout>
  );
};
