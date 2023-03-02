import { FC } from "react";
import { Navigation, Page } from "_components";
import { InvalidStrategyKey } from "_routing";

type Props = Pick<InvalidStrategyKey, "strategyKind" | "strategyId">;

export const ErrorInvalidStrategyKey: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <Page topbar={<Navigation />}>
      <div>
        <span>
          Invalid <em>strategy key</em>
        </span>
        <div>
          <dl>
            <dt>kind</dt>
            <dd>{strategyKind}</dd>
            <dt>id</dt>
            <dd>{strategyId}</dd>
          </dl>
        </div>
      </div>
    </Page>
  );
};
