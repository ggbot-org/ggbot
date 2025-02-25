import {
	isSerializablePrimitive,
	SerializablePrimitive,
} from './serializable.js'
import { IdentifierString, isIdentifierString } from './strings.js'

export type StrategyParameters = {
	[key in IdentifierString]?: SerializablePrimitive | undefined
}

export function isStrategyParameters(arg: unknown): arg is StrategyParameters {
	if (arg === null || typeof arg !== 'object' || Array.isArray(arg))
		return false
	return Object.entries(arg).every(
		([key, value]) =>
			isIdentifierString(key) &&
			(value === undefined ? true : isSerializablePrimitive(value))
	)
}
