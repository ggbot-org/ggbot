import { ErrorCannotCoerceToDecimal } from "./errors.js"

/**
 * Represents a number with decimal digits as a string. Exponential notation is
 * not allowed.
 */
export type Decimal = string

export const isDecimal = (arg: unknown): arg is Decimal => {
	if (typeof arg !== "string") return false
	return isMaybeDecimal(arg)
}

export type MaybeDecimal = Decimal | number

export const isMaybeDecimal = (arg: unknown): arg is MaybeDecimal => {
	const n = Number(arg)
	if (typeof n !== "number" || isNaN(n) || !Number.isFinite(n)) return false
	return true
}

export const decimalToNumber = (arg: MaybeDecimal, numDecimals?: number) =>
	typeof numDecimals === "number"
		? Number(Number(arg).toFixed(numDecimals))
		: Number(arg)

export const numOfDecimals = (num: MaybeDecimal): number => {
	const [_integer, mantissa] = String(num).split(".")
	if (typeof mantissa !== "string") return 0
	// Remove right padded zeros.
	//
	// Create a new number 0.{mantissa}
	// Convert it to string and subtract 2 (the length of '0.')
	//
	// For example:
	//     n = '1.23456789000'
	//     mantissa = '23456789000'
	//     Number 0.{mantissa} = 0.23456789
	const mantissaNum = Number(`0.${mantissa}`)
	if (mantissaNum === 0) return 0
	return String(mantissaNum).length - 2
}

export const maxNumOfDecimals = (values: MaybeDecimal[]): number =>
	values.reduce<number>((max, num) => Math.max(max, numOfDecimals(num)), 0)

export const coerceToDecimal = (
	arg: unknown,
	numDecimals?: number
): Decimal => {
	if (!isMaybeDecimal(arg)) throw new ErrorCannotCoerceToDecimal(arg)
	const n = Number(arg)
	return numDecimals === undefined ? String(n) : n.toFixed(numDecimals)
}
