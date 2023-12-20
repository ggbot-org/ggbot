import { logging } from "_/logging"
import { SerializableData } from "@workspace/models"

type IDBEventType = "open"

const { warn } = logging("indexedDB")

type IDBEventListener = {
	(evt: Event): void
}

type IDBEventListenerObject = {
	handleEvent(object: Event): void
}

// Similar to EventListenerOrEventListenerObject
type IDBEventListenerOrEventListenerObject =
	| IDBEventListener
	| IDBEventListenerObject

/**
 * Interface to implement an IndexedDB instance.
 *
 * @example
 *
 * ```ts
 * class MyDB extends IDBProvider implements IDBInstance {
 * 	readonly databaseName: string
 * 	readonly databaseVersion: number
 *
 * 	constructor() {
 * 		super()
 * 		// Define database name (should not change) and current database version.
 * 		this.databaseName = "myDatabase"
 * 		this.databaseVersion = 1
 * 		// Open database on instantiation.
 * 		super.open(this)
 * 	}
 *
 * 	databaseUpgrade(db: IDBDatabase, version: number) {
 * 		// Upgrade your database: create object stores, indexes, etc.
 * 	}
 * }
 * ```
 */
export type IDBInstance = {
	readonly databaseName: string
	readonly databaseVersion: number
	databaseUpgrade(
		db: IDBDatabase,
		version: IDBInstance["databaseVersion"]
	): void
}

type IDBObjectStoreProvider = {
	readonly storeName: string
	create(db: IDBDatabase): void
}

export class IDBProvider {
	db: IDBDatabase | undefined
	private openRequestState: IDBRequestReadyState | undefined
	private eventTarget: EventTarget

	constructor() {
		this.eventTarget = new EventTarget()
	}

	get isOpen(): boolean | undefined {
		if (this.openRequestState !== "done") return
		return this.db !== undefined
	}

	deleteDatabase() {
		const databaseName = this.db?.name
		if (!databaseName) return
		const request = indexedDB.deleteDatabase(databaseName)
		const cleanup = () => {
			this.db = undefined
			this.openRequestState = undefined
		}
		request.onerror = () => {
			warn(`Cannot delete database ${databaseName}`)
			cleanup()
		}
		request.onsuccess = cleanup
	}

	open(
		instance: Pick<
			IDBInstance,
			"databaseName" | "databaseVersion" | "databaseUpgrade"
		>
	) {
		if (this.isOpen) return
		if (this.openRequestState === "pending") return
		const request = indexedDB.open(
			instance.databaseName,
			instance.databaseVersion
		)
		this.openRequestState = request.readyState
		let updgradeGotError = false
		request.onsuccess = () => {
			if (updgradeGotError) return
			this.db = request.result
			this.openRequestState = request.readyState
			this.eventTarget.dispatchEvent(new CustomEvent("open"))
		}
		request.onupgradeneeded = ({ oldVersion, newVersion }) => {
			if (newVersion === null) return
			for (let i = oldVersion + 1; i <= newVersion; i++) {
				try {
					instance.databaseUpgrade(request.result, newVersion)
				} catch (error) {
					warn(error)
					updgradeGotError = true
				}
			}
		}
	}

	addEventListener(
		type: IDBEventType,
		callback: IDBEventListenerOrEventListenerObject
	): void {
		this.eventTarget.addEventListener(type, callback)
	}

	removeEventListener(
		type: IDBEventType,
		callback: IDBEventListenerOrEventListenerObject
	): void {
		this.eventTarget.removeEventListener(type, callback)
	}
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
		return `${storeBasename}-${databaseVersion}`
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.storeName, {
			keyPath: "type"
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
				request.onerror = () => {
					reject(undefined)
				}
				request.onsuccess = () => {
					resolve(request.result?.data)
				}
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
				request.onerror = () => {
					reject()
				}
				request.onsuccess = () => {
					resolve()
				}
			} catch (error) {
				warn(error)
				reject()
			}
		})
	}
}
