import { NextPage } from "next";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";
import { ErrorStrategyNotOwned } from "_screens";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return <ErrorStrategyNotOwned strategyKind={strategyKind} strategyId={strategyId} />;
};

export default Page;
