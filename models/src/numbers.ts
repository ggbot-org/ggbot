export type NaturalNumber = number

export function isNaturalNumber(arg: unknown): arg is NaturalNumber {
	return typeof arg === "number" && Number.isInteger(arg) && arg > 0
}

export type FiniteNumber = number

export function isFiniteNumber(arg: unknown): arg is FiniteNumber {
	return typeof arg === "number" && Number.isFinite(arg)
}
