import {
  DflowBinanceSymbolInfo,
  isDflowBinanceSymbolInfo,
} from "@ggbot2/dflow";
import { StrategyKey } from "@ggbot2/models";
import { useEffect, useState } from "react";

import { binance } from "../flow/binance.js";

export type UseBinanceSymbolsArg = Partial<Pick<StrategyKey, "strategyKind">>;

type UseBinanceSymbols = (
  arg: UseBinanceSymbolsArg
) => DflowBinanceSymbolInfo[] | undefined;

export const useBinanceSymbols: UseBinanceSymbols = ({ strategyKind }) => {
  const [binanceSymbols, setBinanceSymbols] = useState<
    DflowBinanceSymbolInfo[] | undefined
  >();

  useEffect(() => {
    if (strategyKind !== "binance") return;

    (async () => {
      const exchangeInfo = await binance.exchangeInfo();
      const binanceSymbols = exchangeInfo.symbols.filter(
        isDflowBinanceSymbolInfo
      );
      setBinanceSymbols(binanceSymbols);
    })();
  }, [strategyKind]);

  return binanceSymbols;
};
