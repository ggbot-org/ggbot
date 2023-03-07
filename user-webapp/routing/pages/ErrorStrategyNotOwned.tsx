import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKeyFields } from "_components";
import { OneSectionLayout } from "_layouts";
import { StrategyKey } from "_routing";

type Props = StrategyKey;

export const ErrorStrategyNotOwnedPage: FC<Props> = (strategyKey) => {
  return (
    <OneSectionLayout>
      <Message>
        <span>
          Your account is <b>not</b> <em>owner</em> of this strategy.
        </span>

        <StrategyKeyFields {...strategyKey} />
      </Message>
    </OneSectionLayout>
  );
};
