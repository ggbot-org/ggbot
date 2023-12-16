import { logging } from "_/logging"
import { BinanceApiKey, Subscription } from "@workspace/models"

import {
	IDBInstance,
	IDBObjectStoreProvider,
	IDBProvider
} from "./IndexedDB.js"

const { warn } = logging("userDB")

type UserStore = {
	BinanceApiKey: {
		type: "BinanceApiKey"
		data: BinanceApiKey | null | undefined
	}
	Subscription: {
		type: "Subscription"
		data: Subscription | null | undefined
	}
}

type UserObjectType = keyof UserStore

class UserObjectStore implements IDBObjectStoreProvider {
	readonly storeName: string

	constructor(databaseVersion: UserDB["databaseVersion"]) {
		this.storeName = `user-v${databaseVersion}`
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.storeName, {
			keyPath: "type"
		})
	}
}

class UserDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number
	private objectStore: UserObjectStore

	constructor() {
		super()
		this.databaseName = "user"
		this.databaseVersion = 1
		this.objectStore = new UserObjectStore(this.databaseVersion)
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		// Every UserDB new version creates a new UserObjectStore.
		if (this.databaseVersion === version) this.objectStore.create(db)
	}

	open() {
		super.open(this)
	}

	readSubscription() {
		return this.read<UserStore["Subscription"]["data"]>("Subscription")
	}

	writeSubscription(data: UserStore["Subscription"]["data"]) {
		return this.write({ type: "Subscription", data })
	}

	private read<Data>(type: UserObjectType): Promise<Data | undefined> {
		return new Promise((resolve, reject) => {
			try {
				const {
					db,
					objectStore: { storeName }
				} = this
				if (!db) {
					resolve(undefined)
					return
				}
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

	private write<Type extends UserObjectType>(
		value: UserStore[Type]
	): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				if (value === undefined) {
					resolve()
					return
				}
				const {
					db,
					objectStore: { storeName }
				} = this
				if (!db) return
				const transaction = db.transaction(storeName, "readwrite")
				const objectStore = transaction.objectStore(storeName)
				objectStore.put(value)
			} catch (error) {
				warn(error)
				reject()
			}
		})
	}
}

export const userDB = new UserDB()

userDB.open()
