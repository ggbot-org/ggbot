import { decimalToNumber, div, sub } from "@ggbot2/arithmetic";
import type {
  BinanceSymbolFilter,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
} from "./types.js";
import {
  isBinanceSymbolFilterLotSize,
  isBinanceSymbolFilterMinNotional,
} from "./typeGuards.js";

type FindSymbolFilter<Filter> = (
  filters: BinanceSymbolFilter[]
) => Filter | undefined;

type SymbolFilterIsValid<Filter> = (filter: Filter, value: string) => boolean;

export const findSymbolFilterLotSize: FindSymbolFilter<
  BinanceSymbolFilterLotSize
> = (filters: BinanceSymbolFilter[]) =>
  filters.find(isBinanceSymbolFilterLotSize);

export const findSymbolFilterMinNotional: FindSymbolFilter<
  BinanceSymbolFilterMinNotional
> = (filters: BinanceSymbolFilter[]) =>
  filters.find(isBinanceSymbolFilterMinNotional);

export const lotSizeIsValid: SymbolFilterIsValid<BinanceSymbolFilterLotSize> = (
  { minQty, maxQty, stepSize },
  value
) => {
  if (Number(minQty) !== 0 && value < minQty) return false;
  if (Number(maxQty) !== 0 && value > maxQty) return false;
  return Number.isInteger(decimalToNumber(div(sub(value, minQty), stepSize)));
};

export const minNotionalIsValid: SymbolFilterIsValid<
  BinanceSymbolFilterMinNotional
> = ({ minNotional }, value) => {
  return value > minNotional;
};
