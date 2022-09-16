import type { BinanceSymbolFilterLotSize } from "./types.js";

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
