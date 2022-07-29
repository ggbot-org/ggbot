import type { NextPage } from "next";
import { Content } from "_components";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

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
