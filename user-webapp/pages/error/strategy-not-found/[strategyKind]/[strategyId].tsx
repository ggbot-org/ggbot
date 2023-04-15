import { NextPage } from "next";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";
import { ErrorStrategyNotFoundPage } from "_pages/ErrorStrategyNotFound";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return (
    <ErrorStrategyNotFoundPage
      strategyKind={strategyKind}
      strategyId={strategyId}
    />
  );
};

export default Page;
