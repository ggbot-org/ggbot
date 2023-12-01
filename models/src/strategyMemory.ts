import {
	isSerializablePrimitive,
	SerializablePrimitive
} from "./serializable.js"
import { IdentifierString, isIdentifierString } from "./strings.js"

export type StrategyMemory = {
	[key in IdentifierString]: SerializablePrimitive
}

export const isStrategyMemory = (arg: unknown): arg is StrategyMemory => {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg))
		return false
	return Object.entries(arg).every(
		([key, value]) =>
			isIdentifierString(key) &&
			(value === undefined ? true : isSerializablePrimitive(value))
	)
}
