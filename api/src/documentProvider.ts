import {
	DeletionTime,
	SerializableArray,
	SerializableData,
	UpdateTime
} from "@workspace/models"

/** Provides read-only access to documents. */
export type DocumentProviderLevel1 = {
	getItem<Data extends SerializableData>(key: string): Promise<Data | null>
}

/** Provides read-write access to documents. */
export type DocumentProviderLevel2 = DocumentProviderLevel1 & {
	setItem(key: string, data: SerializableData): Promise<UpdateTime>
	removeItem(key: string): Promise<DeletionTime>
}

/** Provides documents listing. */
export type DocumentProviderLevel3 = DocumentProviderLevel2 & {
	listItems(Prefix: string): Promise<SerializableArray>
}
