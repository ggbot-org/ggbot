import { BinanceApiKey, Subscription } from "@workspace/models"

import { CacheObjectStore, IDBInstance, IDBProvider } from "./IndexedDB.js"

type Schema = {
	BinanceApiKey: {
		type: "BinanceApiKey"
		data: BinanceApiKey | null
	}
	Subscription: {
		type: "Subscription"
		data: Subscription | null
	}
}

class UserDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number
	private objectStore: CacheObjectStore<Schema>

	static databaseName() {
		return "user"
	}

	static cacheObjectStoreBasename() {
		return UserDB.databaseName()
	}

	constructor() {
		super()
		this.databaseName = "user"
		this.databaseVersion = 2
		this.objectStore = new CacheObjectStore(
			this.databaseName,
			this.databaseVersion
		)
		super.open(this)
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === this.databaseVersion) this.objectStore.create(db)
	}

	readSubscription(): Promise<Subscription | null | undefined> {
		const { db, objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.read<Schema["Subscription"]["data"]>(
			db,
			"Subscription"
		)
	}

	writeSubscription(data: Subscription | null): Promise<void> {
		const { db, objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.write<"Subscription">(db, {
			type: "Subscription",
			data
		})
	}
}

export const userDB = new UserDB()
