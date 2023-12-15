export type IDBEventType = "open"

type IDBEventListener = {
	(evt: Event): void
}

type IDBEventListenerObject = {
	handleEvent(object: Event): void
}

// Similar to EventListenerOrEventListenerObject
export type IDBEventListenerOrEventListenerObject =
	| IDBEventListener
	| IDBEventListenerObject

export type IDBProvider = {
	readonly databaseName: string
	readonly version: number
	open(): void
	addEventListener(
		type: IDBEventType,
		callback: IDBEventListenerOrEventListenerObject
	): void
	removeEventListener(
		type: IDBEventType,
		callback: IDBEventListenerOrEventListenerObject
	): void
}

export type IDBObjectStoreProvider = {
	readonly storeName: string
	create(db: IDBDatabase): void
}

export const newIDBEvent: Record<IDBEventType, () => CustomEvent> = {
	open: () => new CustomEvent("open")
}
