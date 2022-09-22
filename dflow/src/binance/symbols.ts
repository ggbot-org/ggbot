import { BinanceSymbolInfo } from "@ggbot2/binance";
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

export const isDflowBinanceSymbolInfo = (
  arg: unknown
): arg is DflowBinanceSymbolInfo => {
  if (typeof arg !== "object" || arg === null) return false;
  const {
    baseAsset,
    baseAssetPrecision,
    baseCommissionPrecision,
    quoteAsset,
    quoteAssetPrecision,
    quotePrecision,
    isSpotTradingAllowed,
    status,
    symbol,
  } = arg as Partial<DflowBinanceSymbolInfo>;
  return (
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
};

export const getDflowBinanceNodeSymbolKind = ({
  baseAsset,
  quoteAsset,
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) =>
  [baseAsset, quoteAsset].join("/");
