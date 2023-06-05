import { createContext } from "react";

import { useStrategy } from "../hooks/useStrategy.js";

type ContextValue = ReturnType<typeof useStrategy>;

export const StrategyContext = createContext<ContextValue>({
  strategyKey: undefined,
  strategyName: "",
});

StrategyContext.displayName = "StrategyContext";
