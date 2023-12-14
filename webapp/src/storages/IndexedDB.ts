export type IDBProvider = {
	open: () => void
}

export type IDBObjectStoreProvider = {
	readonly name: string
	readonly parameters: IDBObjectStoreParameters
}
