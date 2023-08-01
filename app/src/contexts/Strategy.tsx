import { Section } from "@ggbot2/design";
import { isStrategy, noneStrategy, Strategy } from "@ggbot2/models";
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
};

export const StrategyContext = createContext<ContextValue>({
  strategy: noneStrategy,
});

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const strategyKey = strategyKeyParamsFromCurrentLocation();
  const strategyId = strategyKey?.strategyId;

  const READ_STRATEGY = useApi.ReadStrategy();

  const strategy = useMemo(() => {
    if (!strategyId) return noneStrategy;
    const localStrategy = localWebStorage.getStrategy(strategyId);
    if (isStrategy(localStrategy)) return localStrategy;
    const remoteStrategy = READ_STRATEGY.data;
    if (isStrategy(remoteStrategy)) return remoteStrategy;
    return noneStrategy;
  }, [READ_STRATEGY, strategyId]);

  const contextValue = useMemo<ContextValue>(
    () => ({
      strategy,
    }),
    [strategy]
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
