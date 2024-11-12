import { CacheMap } from '@workspace/cache'
import { ExecutorDatabase } from '@workspace/database'
import { AccountKey } from '@workspace/models'

import { ONE_DAY } from './durations.js'

const key = 'accountKeys'
const cache = new CacheMap<AccountKey[]>(ONE_DAY)

export class AccountKeysProvider {
	readonly database: ExecutorDatabase

	constructor(database: ExecutorDatabase) {
		this.database = database
	}

	deleteCachedAccountId(accountId: AccountKey['accountId']): void {
		const items = cache.get(key)
		if (!items) return
		const updatedItems = items.filter((item) => item.accountId !== accountId)
		cache.set(key, updatedItems)
	}

	async getAccountKeys(): Promise<AccountKey[]> {
		const cached = cache.get(key)
		if (cached) return cached
		const { accountKeys: data } = await this.database.ListAccountKeys({ token: undefined })
		cache.set(key, data)
		return data
	}
}
