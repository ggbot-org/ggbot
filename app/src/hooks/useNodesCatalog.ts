import { StrategyKey } from "_routing/types";
import {
  DflowBinanceSymbolInfo,
  getDflowBinanceNodesCatalog,
} from "@ggbot2/dflow";
import { DflowNodesCatalog } from "dflow";

export type UseNodesCatalogArg = Pick<StrategyKey, "strategyKind"> & {
  binanceSymbols?: DflowBinanceSymbolInfo[];
};

type UseNodesCatalog = (
  arg: UseNodesCatalogArg
) => DflowNodesCatalog | undefined;

const nodesCatalogMap = new Map<string, DflowNodesCatalog>();

export const useNodesCatalog: UseNodesCatalog = ({
  strategyKind,
  binanceSymbols,
}) => {
  const storedValue = nodesCatalogMap.get(strategyKind);
  if (storedValue) return storedValue;
  if (strategyKind === "binance" && binanceSymbols) {
    const nodesCatalog = getDflowBinanceNodesCatalog({
      symbols: binanceSymbols,
    });
    nodesCatalogMap.set(strategyKind, nodesCatalog);
    return nodesCatalog;
  }
};
