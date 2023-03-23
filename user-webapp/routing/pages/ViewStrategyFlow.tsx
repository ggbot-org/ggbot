import { DflowBinanceSymbolInfo } from "@ggbot2/dflow";
import { isStrategyFlow } from "@ggbot2/models";
import { FC, useEffect, useCallback, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  BacktestController,
  FlowViewContainer,
  Navigation,
  Page,
  ViewStrategyTopbar,
} from "_components";
import { useApiAction, useBacktesting, useFlowView } from "_hooks";
import { StrategyInfo, route } from "_routing";

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

  const strategyPathname = route.viewFlowPage(strategyKey);

  const backtestingIsEnabled = backtesting?.isEnabled;
  const hasBacktesting = backtesting !== undefined;

  const onChangeBacktestingCheckbox = useCallback(() => {
    backtestingDispatch({ type: "TOGGLE" });
  }, [backtestingDispatch]);

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
      toast.error("Cannot load flow");
    }
  }, [flowView, setFlowLoaded, storedStrategyFlow, readIsPending]);

  return (
    <Page
      metadata={{
        title: "ggbot2 strategy",
        description: strategyName,
        canonical: strategyPathname,
      }}
      topbar={<Navigation noMenu={!hasSession} />}
    >
      <ViewStrategyTopbar
        accountIsOwner={accountIsOwner}
        backtestingIsChecked={backtestingIsEnabled}
        hasBacktesting={hasBacktesting}
        name={strategyName}
        onChangeBacktestingCheckbox={onChangeBacktestingCheckbox}
        strategyKey={strategyKey}
      />

      <BacktestController
        state={backtesting}
        dispatch={backtestingDispatch}
        view={flowView?.graph}
      />

      <FlowViewContainer ref={flowViewContainerRef} />
    </Page>
  );
};
