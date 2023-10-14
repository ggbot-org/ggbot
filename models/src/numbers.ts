export type NaturalNumber = number

export const isNaturalNumber = (arg: unknown): arg is NaturalNumber =>
	typeof arg === "number" && Number.isInteger(arg) && arg > 0

export type FiniteNumber = number

export const isFiniteNumber = (arg: unknown): arg is FiniteNumber =>
	typeof arg === "number" && Number.isFinite(arg)
