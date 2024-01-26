import { DeletionTime, UpdateTime, SerializableData } from "@workspace/models"

/** Provides read-only access to documents. */
export type DocumentProviderLevel1 = {
	getItem<Data extends SerializableData>(key: string): Promise<Data | null>
}

/** Provides read-write access to documents. */
export type DocumentProviderLevel2 = DocumentProviderLevel1 & {
	setItem(key: string, value: SerializableData): Promise<UpdateTime>
	removeItem(key: string): Promise<DeletionTime>
}

// TODO
// /** Provides documents listing. */
// type DocumentProviderLevel3  = DocumentProviderLevel2 & {
// 	listItems(Prefix: string): Promise<SerializableArray>
// }
