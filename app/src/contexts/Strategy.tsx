import { createContext, FC, PropsWithChildren } from "react";

import { useStrategy } from "../hooks/useStrategy.js";

type ContextValue = ReturnType<typeof useStrategy>;

export const StrategyContext = createContext<ContextValue>({
  strategyKey: undefined,
  strategyName: "",
  strategyWhenCreated: undefined,
});

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const strategy = useStrategy();

  return (
    <StrategyContext.Provider value={strategy}>
      {children}
    </StrategyContext.Provider>
  );
};
