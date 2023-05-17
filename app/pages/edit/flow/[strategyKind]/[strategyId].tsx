import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { GetServerSideProps, NextPage } from "next";
import { redirectToAuthenticationPage } from "_routing/redirects";
import { StrategyInfo } from "_routing/types";
import { EditStrategyFlowPage } from "_pages/EditStrategyFlow";

type ServerSideProps = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  return redirectToAuthenticationPage();
};

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
