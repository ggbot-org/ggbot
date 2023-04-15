import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { isStrategyFlow } from "@ggbot2/models";
import { FC, useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { BacktestController } from "_components/BacktestController";
import { FlowViewContainer } from "_components/FlowViewContainer";
import { Navigation } from "_components/Navigation";
import { ViewStrategyTabs } from "_components/ViewStrategyTabs";
import { ViewStrategyTopbar } from "_components/ViewStrategyTopbar";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import { errorMessage } from "_i18n";
import { PageLayout } from "_layouts/Page";
import { StrategyInfo, pathname } from "_routing";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
  hasSession: boolean;
};

export const ViewStrategyFlowPage: FC<Props> = ({
  accountIsOwner,
  binanceSymbols,
  hasSession,
  name: strategyName,
  strategyKey,
}) => {
  const { strategyKind } = strategyKey;

  const [flowLoaded, setFlowLoaded] = useState(false);

  const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
  const { flowView } = useFlowView({
    containerRef: flowViewContainerRef,
    binanceSymbols,
    strategyKind,
  });

  const [backtesting, backtestingDispatch] = useBacktesting({
    ...strategyKey,
    binanceSymbols,
    flowViewGraph: flowView?.graph,
  });

  const [
    readStrategyFlow,
    { data: storedStrategyFlow, isPending: readIsPending },
  ] = useApiAction.ReadStrategyFlow();

  const strategyPathname = pathname.viewFlowPage(strategyKey);

  useEffect(() => {
    if (!flowLoaded) readStrategyFlow(strategyKey);
  }, [flowLoaded, readStrategyFlow, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (readIsPending) return;
      if (storedStrategyFlow === undefined) return;
      if (storedStrategyFlow === null) {
        setFlowLoaded(true);
        return;
      }
      flowView.clearGraph();
      if (isStrategyFlow(storedStrategyFlow)) {
        flowView.loadGraph(storedStrategyFlow.view);
      }
      setFlowLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error(errorMessage.couldNotLoadFlow);
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, readIsPending]);

  return (
    <PageLayout
      metadata={{
        title: strategyName,
        canonical: strategyPathname,
      }}
      topbar={<Navigation noMenu={!hasSession} />}
    >
      <ViewStrategyTopbar
        accountIsOwner={accountIsOwner}
        name={strategyName}
        strategyKey={strategyKey}
      />

      <ViewStrategyTabs
        flow={
          <>
            <FlowViewContainer ref={flowViewContainerRef} />
          </>
        }
        backtest={
          <>
            <BacktestController
              state={backtesting}
              dispatch={backtestingDispatch}
              view={flowView?.graph}
            />
          </>
        }
      />
    </PageLayout>
  );
};
