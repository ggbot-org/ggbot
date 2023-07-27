import { Section } from "@ggbot2/design";
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

import { InvalidStrategyKey } from "../components/InvalidStrategyKey.js";
import { StrategyNotFound } from "../components/StrategyNotFound.js";
import { useApi } from "../hooks/useApi.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

type ContextValue = {
  // If `strategyKey` is not valid or no `strategy` was found, `children` are not rendered.
  strategy: Strategy;
  flow: ReadStrategyFlow["out"] | undefined;
};

export const StrategyContext = createContext<ContextValue>({
  strategy: noneStrategy,
  flow: undefined,
});

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const READ_STRATEGY = useApi.ReadStrategy();
  const strategy = READ_STRATEGY.data;

  const READ_STRATEGY_FLOW = useApi.ReadStrategyFlow();
  const flow = READ_STRATEGY_FLOW.data;

  const strategyKey = strategyKeyParamsFromCurrentLocation();

  const contextValue = useMemo<ContextValue>(
    () => ({
      strategy: isStrategy(strategy) ? strategy : noneStrategy,
      flow: isStrategyFlow(flow) || flow === null ? flow : undefined,
    }),
    [strategy, flow]
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
      <Section>
        <InvalidStrategyKey />
      </Section>
    );

  if (strategy === undefined) return null;

  if (strategy === null)
    return (
      <Section>
        <StrategyNotFound {...strategyKey} />
      </Section>
    );

  return (
    <StrategyContext.Provider value={contextValue}>
      {children}
    </StrategyContext.Provider>
  );
};
