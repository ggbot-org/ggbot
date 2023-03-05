import { NextPage } from "next";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";
import { ErrorStrategyNotOwnedPage } from "_pages";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return <ErrorStrategyNotOwnedPage strategyKind={strategyKind} strategyId={strategyId} />;
};

export default Page;
