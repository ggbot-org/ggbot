import { CacheMap } from "@workspace/cache"
import { ExecutorDatabase } from "@workspace/database"
import { AccountKey } from "@workspace/models"

import { ONE_DAY } from "./durations.js"

const key = "accountKeys"

export class AccountKeysProvider {
	readonly cache: CacheMap<AccountKey[]>
	readonly database: ExecutorDatabase

	constructor(database: ExecutorDatabase) {
		this.cache = new CacheMap<AccountKey[]>(ONE_DAY)
		this.database = database
	}

	deleteCachedAccountId(accountId: AccountKey["accountId"]): void {
		const items = this.cache.get(key)
		if (!items) return
		const updatedItems = items.filter((item) => item.accountId !== accountId)
		this.cache.set(key, updatedItems)
	}

	async getAccountKeys(): Promise<AccountKey[]> {
		const cached = this.cache.get(key)
		if (cached) return cached
		const { accountKeys: data } = await this.database.ListAccountKeys({ token: undefined })
		this.cache.set(key, data)
		return data
	}
}
