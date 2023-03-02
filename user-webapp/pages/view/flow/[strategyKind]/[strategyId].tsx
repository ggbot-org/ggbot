import { BinanceCacheMap, BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readSession } from "@ggbot2/cookies";
import { readStrategy, readStrategyFlow } from "@ggbot2/database";
import { DflowBinanceSymbolInfo, isDflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { GetServerSideProps, NextPage } from "next";
import {
  StrategyInfo,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
  strategyKeyFromRouterParams,
} from "_routing";
import { ViewStrategyFlow } from "_screens";

type ServerSideProps = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
  hasSession: boolean;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ params, req }) => {
  const session = readSession(req.cookies);
  const hasSession = session !== undefined;

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);
  const { strategyKind } = strategyKey;

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);

  const strategyFlow = await readStrategyFlow(strategyKey);
  if (!strategyFlow) return redirectToErrorPageStrategyNotFound(strategyKey);

  const accountIsOwner = session?.accountId === strategy.accountId;

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
    const binanceSymbols = exchangeInfo.symbols.filter(isDflowBinanceSymbolInfo);
    return {
      props: {
        binanceSymbols,
        hasSession,
        ...strategyInfo,
      },
    };
  }

  return { props: { ...strategyInfo, hasSession } };
};

const Page: NextPage<ServerSideProps> = (props) => {
  return <ViewStrategyFlow {...props} />;
};

export default Page;
