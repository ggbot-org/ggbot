import { SerializableArray, SerializableObject } from "./serializable.js"

export type Modifier<Data extends SerializableArray | SerializableObject> =
	Record<string, (arg: Data, ...args: any[]) => Data>
