import {
  BinanceCacheMap,
  BinanceConnector,
  BinanceExchange,
} from "@ggbot2/binance";
import { readStrategy, readStrategyFlow } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { GetServerSideProps, NextPage } from "next";
import {
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
} from "_routing/redirects";
import { strategyKeyFromRouterParams } from "_routing/serverSide";
import { StrategyInfo } from "_routing/types";
import { ViewStrategyFlowPage } from "_pages/ViewStrategyFlow";

type ServerSideProps = Pick<
  StrategyInfo,
  "accountIsOwner" | "strategyKey" | "name"
> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
  hasSession: boolean;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  params,
}) => {
  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);
  const { strategyKind } = strategyKey;

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);

  const strategyFlow = await readStrategyFlow(strategyKey);
  if (!strategyFlow) return redirectToErrorPageStrategyNotFound(strategyKey);

  const accountIsOwner = false;

  const strategyInfo = {
    accountIsOwner,
    strategyKey,
    name: strategy.name,
  };

  if (strategyKind === "binance") {
    const binance = new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
      cache: new BinanceCacheMap(),
    });
    const exchangeInfo = await binance.exchangeInfo();
    const binanceSymbols = exchangeInfo.symbols.filter(
      isDflowBinanceSymbolInfo
    );
    return {
      props: {
        binanceSymbols,
        hasSession: false,
        ...strategyInfo,
      },
    };
  }

  return { props: { ...strategyInfo, hasSession: false } };
};

const Page: NextPage<ServerSideProps> = (props) => (
  <ViewStrategyFlowPage {...props} />
);

export default Page;