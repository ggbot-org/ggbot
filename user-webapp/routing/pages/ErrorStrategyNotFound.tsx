import { Message } from "@ggbot2/design";
import { FC } from "react";
import { StrategyKey } from "_routing";
import { OneSectionLayout } from "_layouts";

type Props = StrategyKey;

export const ErrorStrategyNotFoundPage: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <OneSectionLayout>
      <Message header="Strategy not found">
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
