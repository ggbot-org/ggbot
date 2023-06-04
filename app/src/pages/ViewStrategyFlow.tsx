import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { isStrategyFlow } from "@ggbot2/models";
import { mount } from "@ggbot2/react";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { BacktestController } from "../components/BacktestController.js";
import { FlowViewContainer } from "../components/FlowViewContainer.js";
import { Navigation } from "../components/Navigation.js";
import { ViewStrategyTabs } from "../components/ViewStrategyTabs.js";
import { ViewStrategyTopbar } from "../components/ViewStrategyTopbar.js";
import { useApi } from "../hooks/useApi.js";
import { useBacktesting } from "../hooks/useBacktesting.js";
import { useFlowView } from "../hooks/useFlowView.js";
import { errorMessage } from "../i18n/index.js";
import { PageLayout } from "../layouts/Page.js";
import { StrategyInfo } from "../routing/types.js";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
  hasSession: boolean;
};

const Page: FC<Props> = ({
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
    <PageLayout topbar={<Navigation noMenu={!hasSession} />}>
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
          />
        }
      />
    </PageLayout>
  );
};

mount(Page);
