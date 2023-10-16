// Credits:
// inspired by `JsonValue` in type-fest package
// https://github.com/sindresorhus/type-fest/tree/main
import { FiniteNumber } from "./numbers.js"
import { FiniteString } from "./strings.js"

type SerializablePrimitive = FiniteString | FiniteNumber | boolean | null

type SerializableArray = SerializableData[] | readonly SerializableData[]

// TODO check max label string length in JSON is 256
// max value string length in JSON is 8192 bytes
// https://www.ibm.com/docs/en/datapower-gateway/7.6?topic=20-json-parser-limits
type SerializableObject = { [Key in FiniteString]: SerializableData } & {
	[Key in FiniteString]?: SerializableData | undefined
}

/** Serializable data. */
export type SerializableData =
	| SerializablePrimitive
	| SerializableArray
	| SerializableObject
