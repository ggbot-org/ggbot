// TODO (see below) import { decimalToNumber, div, sub } from "@ggbot2/arithmetic";
import {
  BinanceNewOrderOptions,
  BinanceSymbolFilter,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
} from "./types.js";
import {
  isBinanceSymbolFilterLotSize,
  isBinanceSymbolFilterMinNotional,
} from "./typeGuards.js";

type IcebergQty = NonNullable<BinanceNewOrderOptions["icebergQty"]>;
type Quantity = NonNullable<BinanceNewOrderOptions["quantity"]>;
type QuoteOrderQuantity = NonNullable<BinanceNewOrderOptions["quoteOrderQty"]>;

type FindSymbolFilter<Filter> = (
  filters: BinanceSymbolFilter[]
) => Filter | undefined;

export const findSymbolFilterLotSize: FindSymbolFilter<
  BinanceSymbolFilterLotSize
> = (filters: BinanceSymbolFilter[]) =>
  filters.find(isBinanceSymbolFilterLotSize);

export const findSymbolFilterMinNotional: FindSymbolFilter<
  BinanceSymbolFilterMinNotional
> = (filters: BinanceSymbolFilter[]) =>
  filters.find(isBinanceSymbolFilterMinNotional);

export const lotSizeIsValid = (
  { minQty, maxQty /*stepSize*/ }: BinanceSymbolFilterLotSize,
  value: Quantity | IcebergQty
) => {
  if (Number(minQty) !== 0 && value < minQty) return false;
  if (Number(maxQty) !== 0 && value > maxQty) return false;
  return true;
  // TODO test case
  // args: 0.00001000 9000.00000000 0.00001000
  // result is 98.99999999999999 (not integer)
  // TODO return Number.isInteger(decimalToNumber(div(sub(value, minQty), stepSize)));
};

export const minNotionalIsValid = (
  { minNotional }: BinanceSymbolFilterMinNotional,
  value: QuoteOrderQuantity
) => {
  return value > minNotional;
};
