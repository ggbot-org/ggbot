import { getDflowBinanceNodesCatalog } from "@ggbot2/dflow";
import { DflowNodesCatalog } from "dflow";
import { useContext, useEffect } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useBinanceSymbols } from "../hooks/useBinanceSymbols.js";

const nodesCatalogMap = new Map<string, DflowNodesCatalog>();

export const useNodesCatalog = (): DflowNodesCatalog | undefined => {
  const {
    strategy: { kind: strategyKind },
  } = useContext(StrategyContext);

  const binanceSymbols = useBinanceSymbols();

  useEffect(() => {
    if (strategyKind === "binance") {
      if (!binanceSymbols) return;
      const nodesCatalog = getDflowBinanceNodesCatalog(binanceSymbols);
      nodesCatalogMap.set(strategyKind, nodesCatalog);
    }
  }, [binanceSymbols, strategyKind]);

  return nodesCatalogMap.get(strategyKind);
};
