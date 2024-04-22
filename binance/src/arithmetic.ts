import { BinanceDecimal } from "./types.js"

export const numberToBinanceDecimal = (num: number, precision: number) =>
	num.toFixed(precision)

type BinanceUnaryOperator = (a: BinanceDecimal) => BinanceDecimal

type BinanceBinaryOperator = (
	a: BinanceDecimal,
	b: BinanceDecimal,
	precision?: number
) => BinanceDecimal

type BinanceComparisonOperator = (
	a: BinanceDecimal,
	b: BinanceDecimal
) => boolean

const numOfDecimals = (num: BinanceDecimal): number => {
	const [_integer, mantissa] = String(num).split(".")
	if (typeof mantissa !== "string") return 0
	// Remove right padded zeros.
	//
	// Create a new number
	//
	//     0.{mantissa}
	//
	// Convert it to string and subtract 2 (i.e. the length of '0.')
	//
	// For example:
	//     n = '1.23456789000'
	//     mantissa = '23456789000'
	//     Number 0.{mantissa} = 0.23456789
	const mantissaNum = Number(`0.${mantissa}`)
	if (mantissaNum === 0) return 0
	return String(mantissaNum).length - 2
}

const maxNumOfDecimals = (values: BinanceDecimal[]): number =>
	values.reduce<number>((max, num) => Math.max(max, numOfDecimals(num)), 0)

export const add: BinanceBinaryOperator = (a, b, precision) =>
	(Number(a) + Number(b)).toFixed(precision ?? maxNumOfDecimals([a, b]))

export const sub: BinanceBinaryOperator = (a, b, precision) =>
	(Number(a) - Number(b)).toFixed(precision ?? maxNumOfDecimals([a, b]))

export const mul: BinanceBinaryOperator = (a, b, precision) =>
	(Number(a) * Number(b)).toFixed(precision ?? maxNumOfDecimals([a, b]))

export const div: BinanceBinaryOperator = (a, b, precision) => {
	const result = Number(a) / Number(b)
	if (Number.isFinite(result))
		return result.toFixed(precision ?? maxNumOfDecimals([a, b]))
	throw new Error(`Cannot divide ${a} by ${b}`)
}

export const neg: BinanceUnaryOperator = (a) =>
	(-Number(a)).toFixed(numOfDecimals(a))

export const lessThan: BinanceComparisonOperator = (a, b) =>
	Number(a) < Number(b)

export const greaterThan: BinanceComparisonOperator = (a, b) =>
	Number(a) > Number(b)
