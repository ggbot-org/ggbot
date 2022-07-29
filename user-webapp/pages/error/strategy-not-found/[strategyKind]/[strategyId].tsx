import type { NextPage } from "next";
import { Content } from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">
          Strategy <em>not found</em>
        </span>
        <dl>
          <dt>
            <span className="font-medium uppercase">kind</span>
          </dt>
          <dd>{strategyKind}</dd>
          <dt>
            <span className="font-medium uppercase">ID</span>
          </dt>
          <dd>{strategyId}</dd>
        </dl>
      </div>
    </Content>
  );
};

export default Page;
//
