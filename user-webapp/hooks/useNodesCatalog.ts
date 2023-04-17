import {
  DflowBinanceSymbolInfo,
  getDflowBinanceNodesCatalog,
} from "@ggbot2/dflow";
import { DflowNodesCatalog } from "dflow";
import { useMemo } from "react";
import { StrategyKey } from "_routing/types";

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
