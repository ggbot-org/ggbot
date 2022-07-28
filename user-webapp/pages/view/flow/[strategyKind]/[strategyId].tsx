import type { NextPage } from "next";
import { Content } from "_components";
import { StrategyKey, getStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = getStrategyKey;

const Page: NextPage<ServerSideProps> = (strategyKey) => {
  console.log(strategyKey);
  return <Content>page content</Content>;
};

export default Page;
