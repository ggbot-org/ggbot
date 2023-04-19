import { readSession } from "@ggbot2/cookies";
import { readStrategy } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { GetServerSideProps, NextPage } from "next";
import { binance } from "_flow/binance";
import {
  redirectToAuthenticationPage,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
  redirectToErrorPageStrategyNotOwned,
} from "_routing/redirects";
import { strategyKeyFromRouterParams } from "_routing/serverSide";
import { StrategyInfo } from "_routing/types";
import { EditStrategyFlowPage } from "_pages/EditStrategyFlow";

type ServerSideProps = Pick<StrategyInfo, "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = readSession(req.cookies);
  if (!session) return redirectToAuthenticationPage();

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);
  const { name } = strategy;

  const accountIsOwner = session.accountId === strategy.accountId;
  if (!accountIsOwner) return redirectToErrorPageStrategyNotOwned(strategyKey);

  const { strategyKind } = strategyKey;

  if (strategyKind === "binance") {
    const exchangeInfo = await binance.exchangeInfo();
    const binanceSymbols = exchangeInfo.symbols.filter(
      isDflowBinanceSymbolInfo
    );
    return {
      props: {
        binanceSymbols,
        strategyKey,
        name,
      },
    };
  }

  return {
    props: {
      strategyKey,
      name,
    },
  };
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
