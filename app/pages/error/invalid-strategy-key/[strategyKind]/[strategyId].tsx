import { isStrategyKey } from "@ggbot2/models";
import { GetServerSideProps, NextPage } from "next";
import { InvalidStrategyKey } from "_routing/types";
import { redirectToHomePage } from "_routing/redirects";
import { ErrorInvalidStrategyKeyPage } from "_pages/ErrorInvalidStrategyKey";

type ServerSideProps = InvalidStrategyKey;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const strategyKey = {
    strategyKind: params?.strategyKind?.toString() ?? "undefined",
    strategyId: params?.strategyId?.toString() ?? "undefined",
  };
  if (isStrategyKey(strategyKey)) return redirectToHomePage();
  return {
    props: strategyKey,
  };
};

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => (
  <ErrorInvalidStrategyKeyPage
    strategyKind={strategyKind}
    strategyId={strategyId}
  />
);

export default Page;
