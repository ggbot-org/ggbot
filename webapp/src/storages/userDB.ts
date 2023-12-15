import { SerializableData, Subscription } from "@workspace/models"

import {
	IDBObjectStoreProvider,
	IDBEventType,
	IDBEventListenerOrEventListenerObject,
	IDBProvider,
	newIDBEvent
} from "./IndexedDB.js"

type UserObjectType = "subscription"

type UserObject<Data extends SerializableData> = {
	type: UserObjectType
	data: Data
}

class UserObjectStore implements IDBObjectStoreProvider {
	readonly storeName: string

	constructor(version: UserDB["version"]) {
		this.storeName = `user-v${version}`
	}

	static subscriptionObject(
		data: Subscription | null
	): UserObject<Subscription | null> {
		return {
			type: "subscription",
			data
		}
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.storeName, {
			autoIncrement: false
		})
	}
}

class UserDB implements IDBProvider {
	readonly version: number
	readonly databaseName: string

	readonly objectStore: UserObjectStore

	private eventTarget: EventTarget
	private db: IDBDatabase | undefined

	constructor() {
		this.databaseName = "user"
		this.version = 1
		this.objectStore = new UserObjectStore(this.version)
		this.eventTarget = new EventTarget()
	}

	readSubscription(): Promise<Subscription | null | undefined> {
		return new Promise((resolve, reject) => {
			const {
				db,
				objectStore: { storeName }
			} = this
			if (!db) return Promise.resolve(undefined)
			const transaction = db.transaction(storeName, "readonly")
			const objectStore = transaction.objectStore(storeName)
			const request: IDBRequest<UserObject<Subscription | null>> =
				objectStore.get("subscription")
			request.onerror = () => {
				reject(undefined)
			}
			// TODO should resolve event.target.result
			request.onsuccess = (_event) => {
				resolve(undefined)
			}
		})
	}

	writeSubscription(value: Subscription | null | undefined) {
		if (value === undefined) return
		const {
			db,
			objectStore: { storeName }
		} = this
		if (!db) return
		const transaction = db.transaction(storeName, "readwrite")
		const objectStore = transaction.objectStore(storeName)
		objectStore.put(UserObjectStore.subscriptionObject(value))
	}

	open() {
		if (this.db) return
		const request = indexedDB.open(this.databaseName, this.version)
		request.onsuccess = () => {
			this.db = request.result
			this.eventTarget.dispatchEvent(newIDBEvent.open())
		}
		request.onupgradeneeded = ({ newVersion }) => {
			const db = request.result
			// Every UserDB `newVersion` creates a new UserObjectStore.
			if (newVersion === this.version) this.objectStore.create(db)
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

export const userDB = new UserDB()

userDB.open()
