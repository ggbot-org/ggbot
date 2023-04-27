import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { isStrategyFlow } from "@ggbot2/models";
import { FC, useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { BacktestController } from "_components/BacktestController";
import { FlowViewContainer } from "_components/FlowViewContainer";
import { Navigation } from "_components/Navigation";
import { ViewStrategyTabs } from "_components/ViewStrategyTabs";
import { ViewStrategyTopbar } from "_components/ViewStrategyTopbar";
import { useApi } from "_hooks/useApi";
import { useBacktesting } from "_hooks/useBacktesting";
import { useFlowView } from "_hooks/useFlowView";
import { errorMessage } from "_i18n";
import { PageLayout } from "_layouts/Page";
import { StrategyInfo } from "_routing/types";

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

  const [READ, { data: storedStrategyFlow, isPending }] =
    useApi.ReadStrategyFlow();

  useEffect(() => {
    if (!flowLoaded) READ(strategyKey);
  }, [flowLoaded, READ, strategyKey]);

  useEffect(() => {
    try {
      if (!flowView) return;
      if (isPending) return;
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
  }, [flowView, setFlowLoaded, storedStrategyFlow, isPending]);

  return (
    <PageLayout
      metadata={{
        title: strategyName,
      }}
      topbar={<Navigation noMenu={!hasSession} />}
    >
      <ViewStrategyTopbar
        accountIsOwner={accountIsOwner}
        name={strategyName}
        strategyKey={strategyKey}
      />

      <ViewStrategyTabs
        flow={<FlowViewContainer ref={flowViewContainerRef} />}
        backtest={
          <BacktestController
            state={backtesting}
            dispatch={backtestingDispatch}
            view={flowView?.graph}
          />
        }
      />
    </PageLayout>
  );
};
