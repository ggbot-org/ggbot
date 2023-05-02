import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKeyFields } from "_components/StrategyKeyFields";
import { OneSectionLayout } from "_layouts/OneSection";
import { InvalidStrategyKey } from "_routing/types";

type Props = Pick<InvalidStrategyKey, "strategyKind" | "strategyId">;

export const ErrorInvalidStrategyKeyPage: FC<Props> = (strategyKey) => (
  <OneSectionLayout>
    <Message header="Invalid strategy key">
      <StrategyKeyFields {...strategyKey} />
    </Message>
  </OneSectionLayout>
);
