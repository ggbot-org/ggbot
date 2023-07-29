import { Section } from "@ggbot2/design";
import {
  isStrategy,
  isStrategyFlow,
  noneStrategy,
  ReadStrategyFlow,
  Strategy,
} from "@ggbot2/models";
import { localWebStorage } from "@ggbot2/web-storage";
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
  const strategyKey = strategyKeyParamsFromCurrentLocation();
  const strategyId = strategyKey?.strategyId;

  const READ_STRATEGY = useApi.ReadStrategy();
  const READ_STRATEGY_FLOW = useApi.ReadStrategyFlow();

  const strategy = useMemo(() => {
    if (!strategyId) return noneStrategy;
    const localStrategy = localWebStorage.getStrategy(strategyId);
    if (isStrategy(localStrategy)) return localStrategy;
    const remoteStrategy = READ_STRATEGY.data;
    if (isStrategy(remoteStrategy)) return remoteStrategy;
    return noneStrategy;
  }, [READ_STRATEGY, strategyId]);

  const flow = useMemo(() => {
    if (
      isStrategyFlow(READ_STRATEGY_FLOW.data) ||
      READ_STRATEGY_FLOW.data === null
    )
      return READ_STRATEGY_FLOW.data;
  }, [READ_STRATEGY_FLOW]);

  const contextValue = useMemo<ContextValue>(
    () => ({
      strategy,
      flow,
    }),
    [strategy, flow]
  );

  // Fetch strategy.
  useEffect(() => {
    if (!strategyKey) return;
    if (READ_STRATEGY.canRun) READ_STRATEGY.request(strategyKey);
  }, [READ_STRATEGY, strategyKey]);

  // Cache strategy.
  useEffect(() => {
    if (!strategyId) return;
    const strategy = READ_STRATEGY.data;
    if (isStrategy(strategy)) localWebStorage.setStrategy(strategy);
    if (strategy === null) localWebStorage.removeItem(strategyId);
  }, [READ_STRATEGY, strategyId]);

  // Fetch flow.
  useEffect(() => {
    if (!strategyKey) return;
    if (!READ_STRATEGY.data) return;
    if (READ_STRATEGY_FLOW.canRun) READ_STRATEGY_FLOW.request(strategyKey);
  }, [READ_STRATEGY, READ_STRATEGY_FLOW, strategyKey]);

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
