import { Dflow, DflowData } from "dflow"

export type StrategyInput = {
	[key in string]: DflowData
}

export const isStrategyInput = (arg: unknown): arg is StrategyInput => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return (
		Object.keys(arg).every((key) => typeof key === "string") &&
		Object.values(arg).every((value) => Dflow.isDflowData(value))
	)
}
