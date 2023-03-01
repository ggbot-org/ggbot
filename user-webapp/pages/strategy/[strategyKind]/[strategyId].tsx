import { NextPage } from "next";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo } from "_routing";
import { Strategy } from "_screens";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ strategyKey, whenCreated }) => {
  return <Strategy strategyKey={strategyKey} whenCreated={whenCreated} />;
};

export default Page;
