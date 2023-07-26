import {
  isStrategy,
  isStrategyFlow,
  noneStrategy,
  ReadStrategyFlow,
  Strategy,
} from "@ggbot2/models";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";

import { EmptyPage } from "../components/EmptyPage.js";
import { InvalidStrategyKey } from "../components/InvalidStrategyKey.js";
import { StrategyNotFound } from "../components/StrategyNotFound.js";
import { useApi } from "../hooks/useApi.js";
import { OneSectionLayout } from "../layouts/OneSection.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

type ContextValue = {
  // If `strategyKey` is not valid or no `strategy` was found, `children` are not rendered.
  strategy: Strategy;
  strategyFlow: ReadStrategyFlow["out"] | undefined;
};

export const StrategyContext = createContext<ContextValue>({
  strategy: noneStrategy,
  strategyFlow: undefined,
});

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const READ_STRATEGY = useApi.ReadStrategy();
  const strategy = READ_STRATEGY.data;

  const READ_STRATEGY_FLOW = useApi.ReadStrategyFlow();
  const strategyFlow = READ_STRATEGY_FLOW.data;

  const strategyKey = strategyKeyParamsFromCurrentLocation();

  const contextValue = useMemo<ContextValue>(
    () => ({
      strategy: isStrategy(strategy) ? strategy : noneStrategy,
      strategyFlow:
        isStrategyFlow(strategyFlow) || strategyFlow === null
          ? strategyFlow
          : undefined,
    }),
    [strategy, strategyFlow]
  );

  useEffect(() => {
    if (!strategyKey) return;
    if (READ_STRATEGY.canRun) READ_STRATEGY.request(strategyKey);
  }, [READ_STRATEGY, strategyKey]);

  useEffect(() => {
    if (!strategyKey) return;
    if (!strategy) return;
    if (READ_STRATEGY_FLOW.canRun) READ_STRATEGY_FLOW.request(strategyKey);
  }, [READ_STRATEGY_FLOW, strategy, strategyKey]);

  if (!strategyKey)
    return (
      <OneSectionLayout>
        <InvalidStrategyKey />
      </OneSectionLayout>
    );

  if (strategy === undefined) return <EmptyPage />;

  if (strategy === null)
    return (
      <OneSectionLayout>
        <StrategyNotFound {...strategyKey} />
      </OneSectionLayout>
    );

  return (
    <StrategyContext.Provider value={contextValue}>
      {children}
    </StrategyContext.Provider>
  );
};
