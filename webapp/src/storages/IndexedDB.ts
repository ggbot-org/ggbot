export type IDBProvider = {
	readonly name: string
	readonly version: number
	open(): void
}

export type IDBObjectStoreProvider = {
	readonly name: string
	create(db: IDBDatabase): void
}
