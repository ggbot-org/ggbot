import {
	isSerializablePrimitive,
	SerializablePrimitive} from "./serializable.js"
import { isNonEmptyString, NonEmptyString } from "./strings.js"

export type StrategyMemoryValue = SerializablePrimitive

export const isStrategyMemoryKey = isNonEmptyString

export const isStrategyMemoryValue = isSerializablePrimitive

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
