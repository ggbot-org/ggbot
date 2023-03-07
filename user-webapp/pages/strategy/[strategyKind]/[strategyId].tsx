import { NextPage } from "next";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo } from "_routing";
import { StrategyPage } from "_pages";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ strategyKey, whenCreated, name }) => {
  return <StrategyPage strategyKey={strategyKey} whenCreated={whenCreated} name={name} />;
};

export default Page;
