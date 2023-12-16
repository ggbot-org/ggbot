import { logging } from "_/logging"
import { SerializableData, Subscription } from "@workspace/models"

import {
	IDBInstance,
	IDBObjectStoreProvider,
	IDBProvider
} from "./IndexedDB.js"

const { warn } = logging("userDB")

type UserObjectType = "subscription"

type UserObject<Data extends SerializableData> = {
	type: UserObjectType
	data: Data
}

class UserObjectStore implements IDBObjectStoreProvider {
	readonly storeName: string

	constructor(databaseVersion: UserDB["databaseVersion"]) {
		this.storeName = `user-v${databaseVersion}`
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

class UserDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number
	private objectStore: UserObjectStore
	private databaseProvider: IDBProvider

	constructor() {
		super()
		this.databaseProvider = new IDBProvider()
		this.databaseName = "user"
		this.databaseVersion = 1
		this.objectStore = new UserObjectStore(this.databaseVersion)
	}

	readSubscription(): Promise<Subscription | null | undefined> {
		return new Promise((resolve, reject) => {
			try {
				const {
					databaseProvider: { db },
					objectStore: { storeName }
				} = this
				if (!db) {
					resolve(undefined)
					return
				}
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
			} catch (error) {
				warn(error)
				reject(undefined)
			}
		})
	}

	writeSubscription(value: Subscription | null | undefined): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				if (value === undefined) {
					resolve()
					return
				}
				const {
					databaseProvider: { db },
					objectStore: { storeName }
				} = this
				if (!db) return
				const transaction = db.transaction(storeName, "readwrite")
				const objectStore = transaction.objectStore(storeName)
				objectStore.put(UserObjectStore.subscriptionObject(value))
			} catch (error) {
				warn(error)
				reject()
			}
		})
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		// Every UserDB `newVersion` creates a new UserObjectStore.
		if (version === this.databaseVersion) this.objectStore.create(db)
	}

	open() {
		this.databaseProvider.open(this)
	}
}

export const userDB = new UserDB()

userDB.open()
