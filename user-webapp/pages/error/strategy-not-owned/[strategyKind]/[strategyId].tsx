import { NextPage } from "next";
import { Navigation, Page } from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const StrategyNotOwnedPage: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
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

export default StrategyNotOwnedPage;
