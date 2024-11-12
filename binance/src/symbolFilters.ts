import { BinanceNewOrderOptions, BinanceSymbolFilterLotSize, BinanceSymbolFilterMinNotional } from './types.js'

type IcebergQty = NonNullable<BinanceNewOrderOptions['icebergQty']>
type Quantity = NonNullable<BinanceNewOrderOptions['quantity']>
type QuoteOrderQuantity = NonNullable<BinanceNewOrderOptions['quoteOrderQty']>

export function lotSizeIsValid(
	// TODO { minQty, maxQty, stepSize }: BinanceSymbolFilterLotSize,
	{ minQty, maxQty }: BinanceSymbolFilterLotSize,
	value: Quantity | IcebergQty
) {
	if (Number(minQty) !== 0 && value < minQty) return false
	if (Number(maxQty) !== 0 && value > maxQty) return false
	return true
	// TODO test case
	// args: 0.00001000 9000.00000000 0.00001000
	// result is 98.99999999999999 (not integer)
	// TODO return Number.isInteger(decimalToNumber(div(sub(value, minQty), stepSize)));
}

export function minNotionalIsValid(
	{ minNotional }: BinanceSymbolFilterMinNotional,
	value: QuoteOrderQuantity
) {
	return value > minNotional
}
