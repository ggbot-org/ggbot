import { SerializableData } from "./serializable.js"
import { DeletionTime, UpdateTime } from "./time.js"

/** Provides read-only access to documents. */
export type DocumentProviderLevel1 = {
	getItem<Data extends SerializableData>(key: string): Promise<Data>
}

/** Provides read-write access to documents. */
export type DocumentProviderLevel2 = DocumentProviderLevel1 & {
	setItem(key: string, value: SerializableData): Promise<UpdateTime>
	removeItem(key: string): Promise<DeletionTime>
}

/** Provides documents listing. */
// TODO
// type DocumentProviderLevel3  = DocumentProviderLevel2 & {
// 	listItems(Prefix: string): Promise<SerializableArray>
// }
