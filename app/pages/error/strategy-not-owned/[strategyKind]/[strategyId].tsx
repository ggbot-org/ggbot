import { ErrorStrategyNotOwnedPage } from "_pages/ErrorStrategyNotOwned";
import { requireAuthenticationAndGetStrategyKey } from "_routing/serverSide";
import { StrategyKey } from "_routing/types";
import { NextPage } from "next";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => (
  <ErrorStrategyNotOwnedPage
    strategyKind={strategyKind}
    strategyId={strategyId}
  />
);

export default Page;
