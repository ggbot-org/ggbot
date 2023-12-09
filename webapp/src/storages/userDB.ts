import { Subscription } from "@workspace/models"

import { IDBObjectStoreProvider, IDBProvider } from "./provider.js"

const databaseName = "user"
const databaseVersion = 1

const subscriptionObjectStore: IDBObjectStoreProvider = {
	name: "subscription",
	parameters: { autoIncrement: false }
}

class UserDB implements IDBProvider {
	private db: IDBDatabase | undefined

	get isOpen() {
		return this.db !== undefined
	}

	get subscription(): Subscription | null | undefined {
		const { db } = this
		if (!db) return
		return
	}

	open() {
		if (this.isOpen) return
		const request = indexedDB.open(databaseName, databaseVersion)
		request.onsuccess = () => {
			this.db = request.result
		}
		request.onupgradeneeded = () => {
			const { db } = this
			if (!db) return
			db.createObjectStore(
				subscriptionObjectStore.name,
				subscriptionObjectStore.parameters
			)
		}
	}
}

export const userDB = new UserDB()

userDB.open()
