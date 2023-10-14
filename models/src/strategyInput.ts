import { FiniteNumber, isFiniteNumber } from "./numbers.js"
import { isNonEmptyString, NonEmptyString } from "./strings.js"

type StrategyInputValue = boolean | NonEmptyString | FiniteNumber

const isStrategyInputValue = (arg: unknown): arg is StrategyInputValue => {
	if (typeof arg === "boolean") return true
	if (isNonEmptyString(arg)) return true
	if (isFiniteNumber(arg)) return true
	return false
}

export type StrategyInput = {
	[key in NonEmptyString]: StrategyInputValue
}

export const isStrategyInput = (arg: unknown): arg is StrategyInput => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return (
		Object.keys(arg).every(isNonEmptyString) &&
		Object.values(arg).every(isStrategyInputValue)
	)
}
