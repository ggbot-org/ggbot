import { DeletionTime, SerializableData, UpdateTime } from "@workspace/models"

/** Provides read-only access to documents. */
export type DocumentProviderLevel1 = {
	getItem<Data extends SerializableData>(key: string): Promise<Data | null>
}

/** Provides read-write access to documents. */
export type DocumentProviderLevel2 = DocumentProviderLevel1 & {
	setItem(key: string, data: SerializableData): Promise<UpdateTime>
	removeItem(key: string): Promise<DeletionTime>
}

export type DocumentProviderListItemsInput = {
	prefix: string
	token: string | undefined
	numItems?: number
}

export type DocumentProviderListItemsOutput = {
	keys: string[]
	nextToken: string | undefined
}

/** Provides documents listing. */
export type DocumentProviderLevel3 = DocumentProviderLevel2 & {
	listItems(arg: DocumentProviderListItemsInput): Promise<DocumentProviderListItemsOutput>
}
