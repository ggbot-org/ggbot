import type { NextPage } from "next";
import { Content } from "_components";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ name }) => {
  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">schedule strategy</span>
        <dl>
          <dt>name</dt>
          <dd>{name}</dd>
        </dl>
      </div>
    </Content>
  );
};

export default Page;
