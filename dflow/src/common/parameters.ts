import { SerializablePrimitive } from "@workspace/models"

export type DflowParameter = {
	kind: string
	key: string
	defaultValue: SerializablePrimitive
}
