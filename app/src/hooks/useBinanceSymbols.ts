import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { useContext, useEffect, useRef } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { binance } from "../binance/exchange.js";

export const useBinanceSymbols = (): DflowBinanceSymbolInfo[] | undefined => {
  const {
    strategy: { kind: strategyKind },
  } = useContext(StrategyContext);

  const binanceSymbolsRef = useRef<DflowBinanceSymbolInfo[]>();

  useEffect(() => {
    if (strategyKind !== "binance") return;
    if (binanceSymbolsRef.current) return;
    (async () => {
      const exchangeInfo = await binance.exchangeInfo();
      binanceSymbolsRef.current = exchangeInfo.symbols.filter(
        isDflowBinanceSymbolInfo
      );
    })();
  }, [binanceSymbolsRef, strategyKind]);

  return binanceSymbolsRef.current;
};
