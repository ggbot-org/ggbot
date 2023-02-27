import { NextPage } from "next";
import { Navigation, Page } from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const StrategyNotFoundPage: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
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

export default StrategyNotFoundPage;
