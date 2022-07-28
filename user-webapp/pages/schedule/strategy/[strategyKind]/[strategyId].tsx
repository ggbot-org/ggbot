import type { NextPage } from "next";
import { Content } from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = () => {
  return (
    <Content>
      <div className="p-4">
        <span className="text-xl">schedule strategy</span>
      </div>
    </Content>
  );
};

export default Page;
