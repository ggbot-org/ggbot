import type {
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
