/**
 * Interface to implement an IndexedDB instance.
 *
 * @example
 *
 * ```ts
 * class MyDB extends IDBProvider implements IDBInstance {
 * 	databaseName: string
 * 	databaseVersion: number
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
	databaseName: string
	databaseVersion: number
	databaseUpgrade(
		db: IDBDatabase,
		version: IDBInstance['databaseVersion']
	): void
}
