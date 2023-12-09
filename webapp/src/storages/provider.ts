export type WebStorageProvider = Pick<
	Storage,
	"getItem" | "setItem" | "removeItem" | "clear"
>

export type IDBProvider = {
	readonly isOpen: boolean
	open: () => void
}

export type IDBObjectStoreProvider = {
	readonly name: string
	readonly parameters: IDBObjectStoreParameters
}
