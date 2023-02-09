import { BinanceSymbolInfo } from "@ggbot2/binance";
import { StrategyFlow } from "@ggbot2/models";
import { objectTypeGuard } from "@ggbot2/type-utils";
import { dflowBinancePrecision } from "./arithmetic.js";

export const dflowBinanceQuoteAssets = ["BNB", "BTC", "BUSD", "ETH"];

export type DflowBinanceSymbolInfo = Pick<
  BinanceSymbolInfo,
  | "baseAsset"
  | "baseAssetPrecision"
  | "baseCommissionPrecision"
  | "isSpotTradingAllowed"
  | "quoteAsset"
  | "quoteAssetPrecision"
  | "quotePrecision"
  | "status"
  | "symbol"
>;

export const isDflowBinanceSymbolInfo = objectTypeGuard<DflowBinanceSymbolInfo>(
  ({
    baseAsset,
    baseAssetPrecision,
    baseCommissionPrecision,
    quoteAsset,
    quoteAssetPrecision,
    quotePrecision,
    isSpotTradingAllowed,
    status,
    symbol,
  }) =>
    isSpotTradingAllowed === true &&
    status === "TRADING" &&
    typeof symbol === "string" &&
    typeof baseAsset === "string" &&
    typeof quoteAsset === "string" &&
    symbol === `${baseAsset}${quoteAsset}` &&
    dflowBinanceQuoteAssets.includes(quoteAsset) &&
    // Most of the Binance symbols has precision 8. Others are edge case markets.
    baseAssetPrecision === dflowBinancePrecision &&
    baseCommissionPrecision === dflowBinancePrecision &&
    quoteAssetPrecision === dflowBinancePrecision &&
    quotePrecision === dflowBinancePrecision
);

const dflowBinanceSymbolSeparator = "/";

export const getDflowBinanceNodeSymbolKind = ({
  baseAsset,
  quoteAsset,
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) =>
  [baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator);

export const extractBinanceSymbolsAndIntervalsFromFlow = (
  binanceSymbols: DflowBinanceSymbolInfo[],
  view: StrategyFlow["view"]
): string[] => {
  // TODO look for candles nodes and return [symbol, interval]
  const symbols = binanceSymbols.map(({ symbol }) => symbol);
  return view.nodes
    .filter(({ text }) => text.includes(dflowBinanceSymbolSeparator))
    .map(({ text }) => text.split(dflowBinanceSymbolSeparator).join(""))
    .filter(
      (element, index, array) =>
        // Check that `element` is a symbol and is not duplicated.
        symbols.includes(element) && array.indexOf(element) === index
    );
  // TODO return  list sorted by symbol and interval
};
