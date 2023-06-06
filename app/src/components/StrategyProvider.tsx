import { FC, PropsWithChildren } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useStrategy } from "../hooks/useStrategy.js";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const strategy = useStrategy();

  return (
    <StrategyContext.Provider value={strategy}>
      {children}
    </StrategyContext.Provider>
  );
};
