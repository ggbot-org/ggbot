import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKeyFields } from "_components/StrategyKeyFields";
import { OneSectionLayout } from "_layouts/OneSection";
import { StrategyKey } from "_routing/types";

type Props = StrategyKey;

export const ErrorStrategyNotOwnedPage: FC<Props> = (strategyKey) => (
    <OneSectionLayout>
      <Message>
        <span>
          Your account is <b>not</b> <em>owner</em> of this strategy.
        </span>

        <StrategyKeyFields {...strategyKey} />
      </Message>
    </OneSectionLayout>
  );
