import { FC } from "react";
import { Navigation, Page } from "_components";
import { StrategyKey } from "_routing";

type Props = StrategyKey;

export const ErrorStrategyNotOwned: FC<Props> = ({ strategyKind, strategyId }) => {
  return (
    <Page topbar={<Navigation />}>
      <div className="flex flex-col gap-4 p-4">
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
      </div>
    </Page>
  );
};
