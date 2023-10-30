// Credits:
// inspired by `JsonValue` in type-fest package
// https://github.com/sindresorhus/type-fest/tree/main
// ///
import { FiniteNumber, isFiniteNumber } from "./numbers.js"
import { FiniteString, isFiniteString } from "./strings.js"

export type SerializablePrimitive = FiniteString | FiniteNumber | boolean | null

export const isSerializablePrimitive = (
	arg: unknown
): arg is SerializablePrimitive => (
		isFiniteNumber(arg) ||
		isFiniteString(arg) ||
		typeof arg === "boolean" ||
		arg === null
	)

export type SerializableArray = SerializableData[] | readonly SerializableData[]

// TODO check max label string length in JSON is 256
// max value string length in JSON is 8192 bytes
// https://www.ibm.com/docs/en/datapower-gateway/7.6?topic=20-json-parser-limits
export type SerializableObject = { [Key in FiniteString]: SerializableData } & {
	[Key in FiniteString]?: SerializableData | undefined
}

/** Serializable data, can be stringified into JSON. */
export type SerializableData =
	| SerializablePrimitive
	| SerializableArray
	| SerializableObject

const isSerializableArray = (arg: unknown): arg is SerializableArray =>
	Array.isArray(arg) && arg.every(isSerializableData)

const isSerializableData = (arg: unknown): arg is SerializableData => {
	if (arg === undefined) return false
	return (
		isSerializablePrimitive(arg) ||
		isSerializableArray(arg) ||
		isSerializableObject(arg)
	)
}

export const isSerializableObject = (arg: unknown): arg is SerializableObject =>
	typeof arg === "object" &&
	arg !== null &&
	!Array.isArray(arg) &&
	Object.values(arg).every(isSerializableData)
