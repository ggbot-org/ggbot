import { Dflow, DflowData } from "dflow"

import { isNonEmptyString, NonEmptyString } from "./strings.js"

export type StrategyMemory = {
	[key in NonEmptyString]: DflowData
}

export const isStrategyMemory = (arg: unknown): arg is StrategyMemory => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return (
		Object.keys(arg).every(isNonEmptyString) &&
		Object.values(arg).every((value) => Dflow.isDflowData(value))
	)
}
