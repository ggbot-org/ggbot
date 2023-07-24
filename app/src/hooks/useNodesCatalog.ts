import { getDflowBinanceNodesCatalog } from "@ggbot2/dflow";
import { StrategyKey } from "@ggbot2/models";
import { DflowNodesCatalog } from "dflow";

import { useBinanceSymbols } from "../hooks/useBinanceSymbols.js";

export type UseNodesCatalogArg = Partial<Pick<StrategyKey, "strategyKind">>;

type UseNodesCatalog = (
  arg: UseNodesCatalogArg
) => DflowNodesCatalog | undefined;

const nodesCatalogMap = new Map<string, DflowNodesCatalog>();

export const useNodesCatalog: UseNodesCatalog = ({ strategyKind }) => {
  const binanceSymbols = useBinanceSymbols({ strategyKind });

  const storedValue = strategyKind
    ? nodesCatalogMap.get(strategyKind)
    : undefined;
  if (storedValue) return storedValue;

  if (strategyKind === "binance" && binanceSymbols) {
    const nodesCatalog = getDflowBinanceNodesCatalog({
      symbols: binanceSymbols,
    });
    nodesCatalogMap.set(strategyKind, nodesCatalog);
    return nodesCatalog;
  }
};
