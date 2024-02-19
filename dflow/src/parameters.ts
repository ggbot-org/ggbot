import { SerializablePrimitive } from "@workspace/models"

export type DflowParameter<Kind extends string> = {
	kind: Kind
	key: string
	defaultValue: SerializablePrimitive
}
