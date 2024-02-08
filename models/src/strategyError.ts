import { SerializableObject } from "./serializable.js"
import { CreationTime } from "./time.js"

export type StrategyError = CreationTime & {
	error: SerializableObject
}
