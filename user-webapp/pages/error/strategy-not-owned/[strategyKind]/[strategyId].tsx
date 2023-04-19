import { NextPage } from "next";
import { ErrorStrategyNotOwnedPage } from "_pages/ErrorStrategyNotOwned";
import { StrategyKey } from "_routing/types";
import { requireAuthenticationAndGetStrategyKey } from "_routing/serverSide";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => (
    <ErrorStrategyNotOwnedPage
      strategyKind={strategyKind}
      strategyId={strategyId}
    />
  );

export default Page;
