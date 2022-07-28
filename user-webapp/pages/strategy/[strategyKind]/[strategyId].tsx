import type { NextPage } from "next";
import { Content, StrategyActions } from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = (strategyKey) => {
  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">strategy</span>
        <StrategyActions {...strategyKey} />
      </div>
    </Content>
  );
};

export default Page;
