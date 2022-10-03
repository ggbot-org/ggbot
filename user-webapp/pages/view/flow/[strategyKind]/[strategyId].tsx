import { BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readStrategy } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { Button } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useRef } from "react";
import { ButtonShareStrategy, Content, Navigation } from "_components";
import { useApiAction, useFlowView } from "_hooks";
import {
  StrategyInfo,
  readSession,
  redirectToErrorPageInvalidStrategyKey,
  redirectToErrorPageStrategyNotFound,
  route,
  strategyKeyFromRouterParams,
} from "_routing";

type ServerSideProps = Pick<
  StrategyInfo,
  "accountIsOwner" | "strategyKey" | "name"
> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = readSession(req.cookies);

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

  const strategy = await readStrategy(strategyKey);
  if (!strategy) return redirectToErrorPageStrategyNotFound(strategyKey);

  const accountIsOwner = session?.accountId === strategy.accountId;

  const strategyInfo = {
    accountIsOwner,
    strategyKey,
    name: strategy.name,
  };

  if (strategyKey.strategyKind === "binance") {
    const binance = new BinanceExchange({
      baseUrl: BinanceConnector.defaultBaseUrl,
    });
    const exchangeInfo = await binance.exchangeInfo();
    const binanceSymbols = exchangeInfo.symbols.filter(
      isDflowBinanceSymbolInfo
    );
    return {
      props: {
        binanceSymbols,
        ...strategyInfo,
      },
    };
  }

  return { props: strategyInfo };
};

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  binanceSymbols,
  name,
  strategyKey,
}) => {
  const router = useRouter();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind: strategyKey.strategyKind,
  });

  const [copyIsPending, setCopyIsPending] = useState(false);
  const [editIsPending, setEditIsPending] = useState(false);

  const [readFlow, { data }] = useApiAction.READ_STRATEGY_FLOW();

  const onClickCopy = useCallback(() => {
    router.push(route.copyStrategyPage(strategyKey));
    setCopyIsPending(true);
  }, [router, setCopyIsPending, strategyKey]);

  const onClickEdit = useCallback(() => {
    router.push(route.editFlowPage(strategyKey));
    setEditIsPending(true);
  }, [router, setEditIsPending, strategyKey]);

  useEffect(() => {
    if (!data) return;
    if (!flowView) return;
    flowView.loadGraph(data.view);
  }, [data, flowView]);

  useEffect(() => {
    readFlow({ data: strategyKey });
  }, [readFlow, strategyKey]);

  return (
    <Content
      metadata={{ title: "ggbot2 strategy", description: name }}
      topbar={<Navigation />}
    >
      <div className="flex h-full flex-col grow">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <dl>
            <dt>strategy</dt>
            <dd>{name}</dd>
          </dl>
          <menu className="flex h-10 flex-row gap-4">
            {accountIsOwner ? (
              <Button
                isSpinning={editIsPending}
                color="primary"
                onClick={onClickEdit}
              >
                edit
              </Button>
            ) : (
              <Button
                isSpinning={copyIsPending}
                color="primary"
                onClick={onClickCopy}
              >
                copy
              </Button>
            )}
            <ButtonShareStrategy {...strategyKey} />
          </menu>
        </div>

        <div className="mb-2 w-full grow" ref={flowViewContainerRef}></div>
      </div>
    </Content>
  );
};

export default Page;
