import {
	CacheObjectStore,
	IDBInstance,
	IDBProvider
} from "@workspace/indexeddb"

export class OrdersIDB extends IDBProvider implements IDBInstance {
	readonly databaseName = "orders"
	readonly databaseVersion = 1

	private objectStore: CacheObjectStore

	constructor() {
		super()
		this.objectStore = new CacheObjectStore(
			this.databaseName,
			this.databaseVersion
		)
		super.open(this)
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === 1) this.objectStore.create(db)
	}
}
