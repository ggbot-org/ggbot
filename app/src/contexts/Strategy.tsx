import { isStrategy, Strategy } from "@ggbot2/models";
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react";

import { useApi } from "../hooks/useApi.js";
import { strategyKeyParamsFromCurrentLocation } from "../routing/strategyKeyParams.js";

type ContextValue = {
strategyName: string
strategyKey: ReturnType<typeof strategyKeyParamsFromCurrentLocation>
strategyWhenCreated: Strategy['whenCreated'] | undefined
}

export const StrategyContext = createContext<ContextValue>({
  strategyKey: undefined,
  strategyName: "",
  strategyWhenCreated: undefined,
});

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
const READ = useApi.ReadStrategy()
  const strategy = READ.data

  const strategyKey = strategyKeyParamsFromCurrentLocation();

const contextValue = useMemo<ContextValue>(() => {
if (isStrategy(strategy)) {return {
strategyWhenCreated: strategy.whenCreated,
strategyName: strategy.name,
strategyKey
}} else {
return {
strategyWhenCreated: undefined,
strategyName: "",
strategyKey
}
}
}, [strategy, strategyKey])

useEffect(() => {
if (!strategyKey) return
if (READ.canRun) READ.request(strategyKey)
}, [READ, strategyKey])

  return (
    <StrategyContext.Provider value={contextValue}>
      {children}
    </StrategyContext.Provider>
  );
};
