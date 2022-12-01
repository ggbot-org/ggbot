import { BinanceConnector, BinanceExchange } from "@ggbot2/binance";
import { readStrategy, readStrategyFlow } from "@ggbot2/database";
import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { Button, ButtonOnClick } from "@ggbot2/ui-components";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import {
  BacktestCheckbox,
  BacktestController,
  ButtonShareStrategy,
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationLabel,
  NavigationSettingsIcon,
} from "_components";
import { useBacktesting, useFlowView } from "_hooks";
import {
  StrategyInfo,
  StrategyFlow,
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
  hasSession: boolean;
  strategyFlow: StrategyFlow;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = readSession(req.cookies);
  const hasSession = session !== undefined;

  const strategyKey = strategyKeyFromRouterParams(params);
  if (!strategyKey) return redirectToErrorPageInvalidStrategyKey(params);

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
        hasSession,
        strategyFlow,
        ...strategyInfo,
      },
    };
  }

  return { props: { ...strategyInfo, hasSession, strategyFlow } };
};

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  binanceSymbols,
  hasSession,
  name: strategyName,
  strategyKey,
  strategyFlow,
}) => {
  const router = useRouter();

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind: strategyKey.strategyKind,
  });

  const strategyPathname = useMemo(
    () => route.viewFlowPage(strategyKey),
    [strategyKey]
  );

  const breadcrumbs = useMemo(() => {
    const action = <NavigationLabel text="view" />;
    return hasSession
      ? [
          { content: <NavigationBreadcrumbDashboard isLink /> },
          {
            content: (
              <NavigationBreadcrumbStrategy
                strategyKey={strategyKey}
                isLink={accountIsOwner}
              />
            ),
          },
          { content: action, current: true },
        ]
      : [
          {
            content: <NavigationBreadcrumbStrategy strategyKey={strategyKey} />,
          },
          { content: action, current: true },
        ];
  }, [accountIsOwner, hasSession, strategyKey]);

  const [copyIsSpinning, setCopyIsSpinning] = useState(false);

  const [backtesting, backtestingDispatch] = useBacktesting({
    ...strategyKey,
    binanceSymbols,
    flowViewGraph: flowView?.graph,
  });

  const onChangeBacktestingCheckbox = useCallback(() => {
    backtestingDispatch({ type: "TOGGLE" });
  }, [backtestingDispatch]);

  const onClickCopy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (copyIsSpinning) return;
      setCopyIsSpinning(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [copyIsSpinning, setCopyIsSpinning, router, strategyKey]
  );

  useEffect(() => {
    if (!flowView) return;
    flowView.loadGraph(strategyFlow.view);
  }, [strategyFlow, flowView]);

  return (
    <Content
      metadata={{
        title: "ggbot2 strategy",
        description: strategyName,
        canonical: strategyPathname,
      }}
      topbar={
        <Navigation
          breadcrumbs={breadcrumbs}
          icon={hasSession ? <NavigationSettingsIcon /> : null}
        />
      }
    >
      <div className="flex h-full flex-col grow">
        <div className="flex flex-col justify-between gap-4 py-3 md:flex-row md:items-center">
          <dl>
            <dt>name</dt>
            <dd>{strategyName}</dd>
          </dl>
          <menu className="flex h-10 flex-row gap-4">
            {backtesting && (
              <li>
                <BacktestCheckbox
                  checked={backtesting.isEnabled}
                  onChange={onChangeBacktestingCheckbox}
                />
              </li>
            )}
            <li>
              <ButtonShareStrategy {...strategyKey} />
            </li>
            {accountIsOwner || (
              <li>
                <Button
                  color="primary"
                  isSpinning={copyIsSpinning}
                  onClick={onClickCopy}
                >
                  copy
                </Button>
              </li>
            )}
          </menu>
        </div>

        <BacktestController
          state={backtesting}
          dispatch={backtestingDispatch}
          view={flowView?.graph}
        />

        <div className="mb-2 w-full grow" ref={flowViewContainerRef}></div>
      </div>
    </Content>
  );
};

export default Page;
