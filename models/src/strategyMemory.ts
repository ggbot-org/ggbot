import { FiniteNumber, isFiniteNumber } from "./numbers.js"
import { isNonEmptyString, NonEmptyString } from "./strings.js"

export type StrategyMemoryValue = boolean | NonEmptyString | FiniteNumber

export const isStrategyMemoryKey = isNonEmptyString

export const isStrategyMemoryValue = (
	arg: unknown
): arg is StrategyMemoryValue => {
	if (typeof arg === "boolean") return true
	if (isNonEmptyString(arg)) return true
	if (isFiniteNumber(arg)) return true
	return false
}

export type StrategyMemory = {
	[key in NonEmptyString]: StrategyMemoryValue
}

export const isStrategyMemory = (arg: unknown): arg is StrategyMemory => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return (
		Object.keys(arg).every(isStrategyMemoryKey) &&
		Object.values(arg).every(isStrategyMemoryValue)
	)
}
