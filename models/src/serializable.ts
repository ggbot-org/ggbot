// Credits: inspired by `JsonValue` in type-fest package.
import { FiniteNumber, isFiniteNumber } from "./numbers.js"
import {
	FiniteString,
	IdentifierString,
	isIdentifierString,
	isNonEmptyString
} from "./strings.js"

export type SerializablePrimitive = FiniteString | FiniteNumber | boolean | null

export function isSerializablePrimitive(
	arg: unknown
): arg is SerializablePrimitive {
	return (
		isFiniteNumber(arg) ||
		isNonEmptyString(arg) ||
		typeof arg === "boolean" ||
		arg === null
	)
}

type SerializableArray = SerializableData[] | readonly SerializableData[]

// TODO check max label string length in JSON is 256
// max value string length in JSON is 8192 bytes
// https://www.ibm.com/docs/en/datapower-gateway/7.6?topic=20-json-parser-limits
export type SerializableObject = {
	[Key in IdentifierString]?: SerializableData | undefined
}

/** Serializable data, can be stringified into JSON. */
export type SerializableData =
	| SerializablePrimitive
	| SerializableArray
	| SerializableObject

function isSerializableArray(arg: unknown): arg is SerializableArray {
	return Array.isArray(arg) && arg.every(isSerializableData)
}

function isSerializableData(arg: unknown): arg is SerializableData {
	if (arg === undefined) return false
	return (
		isSerializablePrimitive(arg) ||
		isSerializableArray(arg) ||
		isSerializableObject(arg)
	)
}

export function isSerializableObject(arg: unknown): arg is SerializableObject {
	if (arg === null || typeof arg !== "object" || Array.isArray(arg)) return false
	return Object.entries(arg).every(
		([key, value]) => isIdentifierString(key) &&
			(value === undefined ? true : isSerializableData(value))
	)
}
