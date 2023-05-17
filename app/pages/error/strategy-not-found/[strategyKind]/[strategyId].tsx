import { ErrorStrategyNotFoundPage } from "_pages/ErrorStrategyNotFound";
import { requireAuthenticationAndGetStrategyKey } from "_routing/serverSide";
import { StrategyKey } from "_routing/types";
import { NextPage } from "next";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => (
  <ErrorStrategyNotFoundPage
    strategyKind={strategyKind}
    strategyId={strategyId}
  />
);

export default Page;
