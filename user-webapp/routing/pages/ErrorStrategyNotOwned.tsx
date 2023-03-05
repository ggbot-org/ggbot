import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts";
import { StrategyKey } from "_routing";

type Props = StrategyKey;

export const ErrorStrategyNotOwnedPage: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <OneSectionLayout>
      <Message>
        <span>
          Your account is <b>not</b> <em>owner</em> of this strategy.
        </span>
        <div>
          <dl>
            <dt>kind</dt>
            <dd>{strategyKind}</dd>
            <dt>id</dt>
            <dd>{strategyId}</dd>
          </dl>
        </div>
      </Message>
    </OneSectionLayout>
  );
};
