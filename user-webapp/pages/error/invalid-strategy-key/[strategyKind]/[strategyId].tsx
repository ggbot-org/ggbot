import { isStrategyKey } from "@ggbot2/models";
import type { GetServerSideProps, NextPage } from "next";
import { Content } from "_components";
import { InvalidStrategyKey, redirectToHomePage } from "_routing";

type ServerSideProps = InvalidStrategyKey;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const strategyKey = {
    strategyKind: params?.strategyKind?.toString() ?? "undefined",
    strategyId: params?.strategyId?.toString() ?? "undefined",
  };
  if (isStrategyKey(strategyKey)) return redirectToHomePage();
  return {
    props: strategyKey,
  };
};

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">
          Invalid <em>strategy key</em>
        </span>
        <div className="p-4 shadow">
          <dl>
            <dt>kind</dt>
            <dd>{strategyKind}</dd>
            <dt>id</dt>
            <dd>{strategyId}</dd>
          </dl>
        </div>
      </div>
    </Content>
  );
};

export default Page;
//
