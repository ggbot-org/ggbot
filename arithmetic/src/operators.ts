import {
	coerceToDecimal,
	Decimal,
	maxNumOfDecimals,
	MaybeDecimal,
	numOfDecimals
} from "./decimal.js"
import { ErrorCannotDivideByZero } from "./errors.js"

type ArithmeticOperator = (
	a: MaybeDecimal,
	b: MaybeDecimal,
	numDecimals?: number
) => Decimal

/** Equality operator. */
export const equal = (a: MaybeDecimal, b: MaybeDecimal): boolean => {
	const numDecimals = maxNumOfDecimals([a, b])
	return Number(a).toFixed(numDecimals) === Number(b).toFixed(numDecimals)
}

/** Addition operator. */
export const add: ArithmeticOperator = (a, b, numDecimals) =>
	coerceToDecimal(
		Number(a) + Number(b),
		numDecimals ?? maxNumOfDecimals([a, b])
	)

/** Subtraction operator. */
export const sub: ArithmeticOperator = (a, b, numDecimals) =>
	coerceToDecimal(
		Number(a) - Number(b),
		numDecimals ?? maxNumOfDecimals([a, b])
	)

/** Multiplication operator. */
export const mul: ArithmeticOperator = (a, b, numDecimals) =>
	coerceToDecimal(
		Number(a) * Number(b),
		numDecimals ?? maxNumOfDecimals([a, b])
	)

/** Division operator. */
export const div: ArithmeticOperator = (a, b, numDecimals) => {
	if (equal(b, coerceToDecimal(0, numOfDecimals(b))))
		throw new ErrorCannotDivideByZero()
	// Cannot use `maxNumOfDecimals` 'cause the `numOfDecimals` is
	// not preserved with division, for example
	//
	//     1 / 2 = 0.5
	//     ↑   ↑     ↑
	//     0   0 ->  1 numOfDecimals
	//
	return coerceToDecimal(Number(a) / Number(b), numDecimals)
}
