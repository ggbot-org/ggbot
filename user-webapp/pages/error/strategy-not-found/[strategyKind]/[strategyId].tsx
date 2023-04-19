import { NextPage } from "next";
import { requireAuthenticationAndGetStrategyKey } from "_routing/serverSide";
import { StrategyKey } from "_routing/types";
import { ErrorStrategyNotFoundPage } from "_pages/ErrorStrategyNotFound";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => (
    <ErrorStrategyNotFoundPage
      strategyKind={strategyKind}
      strategyId={strategyId}
    />
  );

export default Page;
