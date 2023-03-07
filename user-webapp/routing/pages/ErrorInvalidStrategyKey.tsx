import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKeyFields } from "_components";
import { OneSectionLayout } from "_layouts";
import { InvalidStrategyKey } from "_routing";

type Props = Pick<InvalidStrategyKey, "strategyKind" | "strategyId">;

export const ErrorInvalidStrategyKeyPage: FC<Props> = (strategyKey) => {
  return (
    <OneSectionLayout>
      <Message header="Invalid strategy key">
        <StrategyKeyFields {...strategyKey} />
      </Message>
    </OneSectionLayout>
  );
};
