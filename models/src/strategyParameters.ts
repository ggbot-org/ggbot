import { FiniteNumber, isFiniteNumber } from "./numbers.js"
import { isNonEmptyString, NonEmptyString } from "./strings.js"

type StrategyParameterValue = boolean | NonEmptyString | FiniteNumber

export const isStrategyParameterKey = isNonEmptyString

export const isStrategyParameterNumber = isFiniteNumber
export const isStrategyParameterString = isNonEmptyString

const isStrategyParameterValue = (
	arg: unknown
): arg is StrategyParameterValue => {
	if (typeof arg === "boolean") return true
	if (isStrategyParameterString(arg)) return true
	if (isStrategyParameterNumber(arg)) return true
	return false
}

export type StrategyParameters = {
	[key in NonEmptyString]: StrategyParameterValue
}

export const isStrategyParameters = (
	arg: unknown
): arg is StrategyParameters => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return (
		Object.keys(arg).every(isStrategyParameterKey) &&
		Object.values(arg).every(isStrategyParameterValue)
	)
}
