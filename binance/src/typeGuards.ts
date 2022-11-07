import { isDecimal } from "@ggbot2/arithmetic";
import { isLiteralType } from "@ggbot2/models";

import type {
  BinanceKlineOptionalParameters,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
} from "./types.js";

export const isBinanceSymbolFilterLotSize = (
  arg: unknown
): arg is BinanceSymbolFilterLotSize => {
  if (typeof arg !== "object" || arg === null) return false;
  const { filterType, minQty, maxQty, stepSize } =
    arg as Partial<BinanceSymbolFilterLotSize>;
  return (
    filterType === "LOT_SIZE" &&
    isDecimal(minQty) &&
    isDecimal(maxQty) &&
    isDecimal(stepSize)
  );
};

export const isBinanceSymbolFilterMinNotional = (
  arg: unknown
): arg is BinanceSymbolFilterMinNotional => {
  if (typeof arg !== "object" || arg === null) return false;
  const { filterType, minNotional, applyToMarket, avgPriceMins } =
    arg as Partial<BinanceSymbolFilterMinNotional>;
  return (
    filterType === "MIN_NOTIONAL" &&
    isDecimal(minNotional) &&
    typeof applyToMarket === "boolean" &&
    typeof avgPriceMins === "number"
  );
};

export const binanceKlineIntervals = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
] as const;
export type BinanceKlineInterval = typeof binanceKlineIntervals[number];
export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(
  binanceKlineIntervals
);

export const binanceKlineMaxLimit = 1000;

export const isBinanceKlineOptionalParameters = (
  arg: unknown
): arg is BinanceKlineOptionalParameters => {
  if (typeof arg !== "object" || arg === null) return false;
  const { startTime, endTime, limit } =
    arg as Partial<BinanceKlineOptionalParameters>;
  // If a parameter is defined it must be a number.
  if (typeof startTime !== "undefined" && typeof startTime !== "number")
    return false;
  if (typeof endTime !== "undefined" && typeof endTime !== "number")
    return false;
  if (typeof limit !== "undefined" && typeof limit !== "number") return false;
  // startTime must preceed endTime.
  if (typeof startTime === "number" && typeof endTime === "number") {
    if (startTime > endTime) return false;
  }
  if (typeof limit === "number") {
    return limit > 0 && limit <= binanceKlineMaxLimit;
  }
  return true;
};
