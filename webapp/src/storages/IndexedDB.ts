import { logging } from "_/logging"

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
 * 		this.databaseName = "myDatabase"
 * 		this.databaseVersion = 1
 * 	}
 *
 * 	open() {
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
	readonly isOpen: boolean | undefined
	databaseUpgrade(
		db: IDBDatabase,
		version: IDBInstance["databaseVersion"]
	): void
	open(): void
}

export type IDBObjectStoreProvider = {
	readonly storeName: string
	create(db: IDBDatabase): void
}

export class IDBProvider implements Pick<IDBInstance, "isOpen"> {
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

	open({
		databaseName,
		databaseVersion,
		databaseUpgrade
	}: Pick<
		IDBInstance,
		"databaseName" | "databaseVersion" | "databaseUpgrade"
	>) {
		if (this.isOpen) return
		if (this.openRequestState === "pending") return
		const request = indexedDB.open(databaseName, databaseVersion)
		this.openRequestState = request.readyState
		let updgradeGotError = false
		request.onsuccess = () => {
			if (updgradeGotError) return
			this.db = request.result
			this.eventTarget.dispatchEvent(new CustomEvent("open"))
		}
		request.onupgradeneeded = ({ oldVersion, newVersion }) => {
			if (!newVersion) return
			for (let i = oldVersion + 1; i <= newVersion; i++) {
				try {
					databaseUpgrade(request.result, newVersion)
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
