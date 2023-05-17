import { StrategyKeyFields } from "_components/StrategyKeyFields";
import { OneSectionLayout } from "_layouts/OneSection";
import { InvalidStrategyKey } from "_routing/types";
import { Message } from "@ggbot2/design";
import { FC } from "react";

type Props = Pick<InvalidStrategyKey, "strategyKind" | "strategyId">;

export const ErrorInvalidStrategyKeyPage: FC<Props> = (strategyKey) => (
  <OneSectionLayout>
    <Message header="Invalid strategy key">
      <StrategyKeyFields {...strategyKey} />
    </Message>
  </OneSectionLayout>
);
