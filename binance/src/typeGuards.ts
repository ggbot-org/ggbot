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
    typeof minQty === "string" &&
    typeof maxQty === "string" &&
    typeof stepSize === "string"
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
    typeof minNotional === "string" &&
    typeof applyToMarket === "boolean" &&
    typeof avgPriceMins === "number"
  );
};

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
