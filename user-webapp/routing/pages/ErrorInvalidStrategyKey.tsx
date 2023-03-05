import { Message } from "@ggbot2/design";
import { FC } from "react";
import { OneSectionLayout } from "_layouts";
import { InvalidStrategyKey } from "_routing";

type Props = Pick<InvalidStrategyKey, "strategyKind" | "strategyId">;

export const ErrorInvalidStrategyKeyPage: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <OneSectionLayout>
      <Message header="Invalid strategy key">
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
