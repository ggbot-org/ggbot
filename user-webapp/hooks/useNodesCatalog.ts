import {
  DflowBinanceSymbolInfo,
  getDflowBinanceNodesCatalog,
} from "@ggbot2/dflow";
import type { DflowNodesCatalog } from "dflow";
import { useMemo } from "react";
import type { StrategyKey } from "_routing";

export type UseNodesCatalogArg = Pick<StrategyKey, "strategyKind"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

type UseNodesCatalog = (
  arg: UseNodesCatalogArg
) => DflowNodesCatalog | undefined;

export const useNodesCatalog: UseNodesCatalog = ({
  strategyKind,
  binanceSymbols,
}) => {
  const nodesCatalog = useMemo<DflowNodesCatalog | undefined>(() => {
    if (strategyKind === "binance" && binanceSymbols)
      return getDflowBinanceNodesCatalog({ symbols: binanceSymbols });
  }, [binanceSymbols, strategyKind]);
  return nodesCatalog;
};
