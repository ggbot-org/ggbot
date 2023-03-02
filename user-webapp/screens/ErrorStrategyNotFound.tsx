import { FC } from "react";
import { Navigation, Page } from "_components";
import { StrategyKey } from "_routing";

type Props = StrategyKey;

export const ErrorStrategyNotFound: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <Page topbar={<Navigation />}>
      <div>
        <span>
          Strategy <em>not found</em>
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
