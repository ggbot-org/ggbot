import { SerializableData } from "@workspace/models"

import { IDBInstance } from "./instance.js"
import { warn } from "./logging.js"

type IDBObjectStoreProvider = {
	readonly storeName: string
	create(db: IDBDatabase): void
}

export class CacheObjectStore<
	Schema extends Record<
		string,
		{
			type: string
			data: SerializableData
		}
	>
> implements IDBObjectStoreProvider
{
	readonly storeName: string

	constructor(
		storeBasename: string,
		databaseVersion: IDBInstance["databaseVersion"]
	) {
		this.storeName = CacheObjectStore.storeName(
			storeBasename,
			databaseVersion
		)
	}

	static storeName(
		storeBasename: string,
		databaseVersion: IDBInstance["databaseVersion"]
	) {
		return `${storeBasename}-v${databaseVersion}`
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.storeName, {
			keyPath: "type"
		})
	}

	delete(db: IDBDatabase, type: Schema[keyof Schema]["type"]): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				const { storeName } = this
				const transaction = db.transaction(storeName, "readwrite")
				const objectStore = transaction.objectStore(storeName)
				const request: IDBRequest<undefined> = objectStore.delete(type)
				request.onerror = () => reject()
				request.onsuccess = () => resolve()
			} catch (error) {
				warn(error)
				reject(undefined)
			}
		})
	}

	read<Data extends Schema[keyof Schema]["data"]>(
		db: IDBDatabase,
		type: Schema[keyof Schema]["type"]
	): Promise<Data | undefined> {
		return new Promise((resolve, reject) => {
			try {
				const { storeName } = this
				const transaction = db.transaction(storeName, "readonly")
				const objectStore = transaction.objectStore(storeName)
				const request: IDBRequest<{ data: Data } | undefined> =
					objectStore.get(type)
				request.onerror = () => reject(undefined)
				request.onsuccess = () => resolve(request.result?.data)
			} catch (error) {
				warn(error)
				reject(undefined)
			}
		})
	}

	write<Type extends keyof Schema>(
		db: IDBDatabase,
		data: Schema[Type]
	): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				const { storeName } = this
				const transaction = db.transaction(storeName, "readwrite")
				const objectStore = transaction.objectStore(storeName)
				const request = objectStore.put(data)
				request.onerror = () => reject()
				request.onsuccess = () => resolve()
			} catch (error) {
				warn(error)
				reject()
			}
		})
	}
}
