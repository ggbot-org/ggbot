import { SerializableData, Subscription } from "@workspace/models"

import { IDBObjectStoreProvider, IDBProvider } from "./IndexedDB.js"

type UserObjectType = "subscription"

type UserObject = {
	type: UserObjectType
	data: SerializableData
}

class UserObjectStore implements IDBObjectStoreProvider {
	readonly name: string

	constructor(version: UserDB["version"]) {
		this.name = `user-v${version}`
	}

	create(db: IDBDatabase) {
		db.createObjectStore(this.name, {
			autoIncrement: false
		})
	}

	get(_type: UserObjectType): UserObject["data"] {
		return null
	}

	set(_obj: UserObject): void {}
}

class UserDB implements IDBProvider {
	readonly version: number
	readonly name: string

	readonly objectStore: UserObjectStore

	private db: IDBDatabase | undefined

	constructor() {
		this.name = "user"
		this.version = 1
		this.objectStore = new UserObjectStore(this.version)
	}

	get subscription(): Subscription | null | undefined {
		const { db } = this
		if (!db) return
		return
	}

	open() {
		if (this.db) return
		const request = indexedDB.open(this.name, this.version)
		request.onsuccess = () => {
			this.db = request.result
		}
		request.onupgradeneeded = ({ newVersion }) => {
			const db = request.result
			// Every UserDB new version creates a new UserObjectStore.
			if (newVersion === this.version) {
				this.objectStore.create(db)
			}
		}
	}
}

export const userDB = new UserDB()

userDB.open()
