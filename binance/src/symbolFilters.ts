import type {
  BinanceSymbolFilter,
  BinanceSymbolFilterLotSize,
} from "./types.js";
import { isBinanceSymbolFilterLotSize } from "./typeGuards.js";

type FindSymbolFilter<Filter> = (
  filters: BinanceSymbolFilter[]
) => Filter | undefined;

type SymbolFilterIsValid<Filter> = (
  filter: Filter,
  quantity: string
) => boolean;

export const findSymbolFilterLotSize: FindSymbolFilter<
  BinanceSymbolFilterLotSize
> = (filters: BinanceSymbolFilter[]) =>
  filters.find(isBinanceSymbolFilterLotSize);

export const lotSizeIsValid: SymbolFilterIsValid<
  BinanceSymbolFilterLotSize
> = (/*{ minQty, maxQty, stepSize }, quantity*/) => {
  return false;
};
