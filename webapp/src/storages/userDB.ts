import { Subscription } from "@workspace/models"

import { IDBObjectStoreProvider, IDBProvider } from "./IndexedDB.js"

const databaseName = "user"
const databaseVersion1 = 1

const subscriptionObjectStore: IDBObjectStoreProvider = {
	name: "subscription",
	parameters: { autoIncrement: false }
}

class UserDB extends EventTarget implements IDBProvider {
	private db: IDBDatabase | undefined

	get subscription(): Subscription | null | undefined {
		const { db } = this
		if (!db) return
		return
	}

	open() {
		if (this.db) return
		const request = indexedDB.open(databaseName, databaseVersion1)
		request.onsuccess = () => {
			this.db = request.result
		}
		request.onupgradeneeded = (event) => {
			const { newVersion, oldVersion } = event
			const db = request.result
			if (oldVersion === null && newVersion === 1) {
				db.createObjectStore(
					subscriptionObjectStore.name,
					subscriptionObjectStore.parameters
				)
			}
		}
	}
}

export const userDB = new UserDB()

userDB.open()
