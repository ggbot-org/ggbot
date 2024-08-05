import { CacheObjectStore, IDBInstance, IDBProvider } from "@workspace/indexeddb"
import { StrategyError, StrategyKey } from "@workspace/models"
import { Day } from "minimal-time-helpers"

export class ErrorsIDB extends IDBProvider implements IDBInstance {
	readonly databaseName = "errors"
	readonly databaseVersion = 1

	private objectStore: CacheObjectStore

	constructor() {
		super()
		this.objectStore = new CacheObjectStore(this.databaseName, this.databaseVersion)
		super.open(this)
	}

	static dailyErrorsKey({ strategyId, strategyKind }: StrategyKey, day: Day) {
		return `${strategyKind}:${strategyId}/${day}`
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === 1) this.objectStore.create(db)
	}

	readDailyErrors(strategyKey: StrategyKey, day: Day): Promise<StrategyError[] | undefined> {
		if (!this.db) return Promise.reject()
		return this.objectStore.read<StrategyError[]>(this.db, ErrorsIDB.dailyErrorsKey(strategyKey, day))
	}

	writeDailyErrors(strategyKey: StrategyKey, day: Day, data: StrategyError[]): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.write<StrategyError[]>(this.db, ErrorsIDB.dailyErrorsKey(strategyKey, day), data)
	}
}
