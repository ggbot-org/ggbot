import { EditStrategyFlowPage } from "_pages/EditStrategyFlow";
import { redirectToAuthenticationPage } from "_routing/redirects";
import { StrategyInfo } from "_routing/types";
import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { GetServerSideProps, NextPage } from "next";

type ServerSideProps = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async () =>
  redirectToAuthenticationPage();

const Page: NextPage<ServerSideProps> = ({
  binanceSymbols,
  name,
  strategyKey,
}) => (
  <EditStrategyFlowPage
    binanceSymbols={binanceSymbols}
    name={name}
    strategyKey={strategyKey}
  />
);

export default Page;
