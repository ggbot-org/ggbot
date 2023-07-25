import {
  isStrategy,
  noneStrategyKind,
  nullId,
  Strategy,
  StrategyKey,
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
  strategyName: string;
  strategyKey: StrategyKey;
  strategyWhenCreated: Strategy["whenCreated"];
};

const initialContextValue: ContextValue = {
  strategyKey: {
    strategyId: nullId,
    strategyKind: noneStrategyKind,
  },
  strategyName: "",
  strategyWhenCreated: 0,
};

export const StrategyContext = createContext<ContextValue>(initialContextValue);

StrategyContext.displayName = "StrategyContext";

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
  const READ = useApi.ReadStrategy();
  const strategy = READ.data;

  const strategyKey = strategyKeyParamsFromCurrentLocation();

  const contextValue = useMemo<ContextValue>(
    () =>
      strategyKey && isStrategy(strategy)
        ? {
            strategyKey,
            strategyName: strategy.name,
            strategyWhenCreated: strategy.whenCreated,
          }
        : initialContextValue,
    [strategy, strategyKey]
  );

  useEffect(() => {
    if (!strategyKey) return;
    if (READ.canRun) READ.request(strategyKey);
  }, [READ, strategyKey]);

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
