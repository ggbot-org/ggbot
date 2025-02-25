import { SerializableData } from '@workspace/models'

import { IDBInstance } from './instance.js'

type IDBObjectStoreProvider = {
	storeName: string
	create(db: IDBDatabase): void
}

export class CacheObjectStore implements IDBObjectStoreProvider {
	storeName: string

	constructor(
		storeBasename: string,
		databaseVersion: IDBInstance['databaseVersion']
	) {
		this.storeName = `${storeBasename}-v${databaseVersion}`
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.storeName, { keyPath: 'key' })
	}

	delete(db: IDBDatabase, key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const { storeName } = this
			const transaction = db.transaction(storeName, 'readwrite')
			const objectStore = transaction.objectStore(storeName)
			const request: IDBRequest<undefined> = objectStore.delete(key)
			request.onerror = () => reject()
			request.onsuccess = () => resolve()
		})
	}

	read<Data extends SerializableData>(
		db: IDBDatabase,
		key: string
	): Promise<Data | undefined> {
		return new Promise((resolve, reject) => {
			const { storeName } = this
			const transaction = db.transaction(storeName, 'readonly')
			const objectStore = transaction.objectStore(storeName)
			const request: IDBRequest<{ data: Data } | undefined> =
				objectStore.get(key)
			request.onerror = () => reject(undefined)
			request.onsuccess = () => resolve(request.result?.data)
		})
	}

	write<Data extends SerializableData>(
		db: IDBDatabase,
		key: string,
		data: Data
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const { storeName } = this
			const transaction = db.transaction(storeName, 'readwrite')
			const objectStore = transaction.objectStore(storeName)
			const request = objectStore.put({ key, data })
			request.onerror = () => reject()
			request.onsuccess = () => resolve()
		})
	}
}
