import { CacheMap } from "@workspace/cache"
import { ExecutorDatabase } from "@workspace/database"
import { AccountKey, accountStrategiesModifier, AccountStrategy, AccountStrategyKey, AccountStrategySchedulingKey, isAccount, isAccountStrategy, StrategyMemory } from "@workspace/models"

import { ONE_HOUR } from "./durations.js"

const cache = new CacheMap<AccountStrategy[]>(ONE_HOUR)

export class AccountStrategiesProvider {
	readonly database: ExecutorDatabase

	constructor(database: ExecutorDatabase) {
		this.database = database
	}

	async getAccountStrategies({ accountId }: AccountKey): Promise<AccountStrategy[]> {
		const accountStrategies: AccountStrategy[] = []
		const cached = cache.get(accountId)
		if (cached) return cached
		const data = await this.database.ReadAccountStrategies({ accountId })
		for (const item of data) if (isAccountStrategy(item)) accountStrategies.push(item)
		cache.set(accountId, accountStrategies)
		return accountStrategies
	}

	async suspendAccountStrategyScheduling(
		{ accountId, strategyId, schedulingId }: AccountStrategySchedulingKey
		// The `strategyKind` is needed to send email notification.
		// TODO enable emails
		// strategyKind: StrategyKind
	) {
		console.warn(`Suspend strategy scheduling accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`)

		// Update cache locally.
		const items = cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.suspendScheduling(items, strategyId, schedulingId)
			cache.set(accountId, data)
		}

		// Update database remotely.
		await this.database.SuspendAccountStrategyScheduling({ accountId, strategyId, schedulingId })

		// Send email notification.
		const account = await this.database.ReadAccount({ accountId })
		// Account may be null in case user deleted the account.
		if (!isAccount(account)) return
		// If there is an account, notify the user via email.
		// TODO enable emails
		// await this.sendEmailProvider.SuspendedStrategy({
		// 	language: "en",
		// 	email: account.email,
		// 	strategyId,
		// 	strategyKind
		// })
	}

	async suspendAccountStrategySchedulings({ accountId, strategyId }: Pick<AccountStrategyKey, "accountId" | "strategyId">) {
		console.warn(`Suspend strategy accountId=${accountId} strategyId=${strategyId}`)

		// Update cache locally.
		const items = cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.suspendStrategySchedulings(items, strategyId)
			cache.set(accountId, data)
		}

		// Update database remotely.
		await this.database.SuspendAccountStrategySchedulings({ accountId, strategyId })
	}

	async updateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId }: AccountStrategySchedulingKey, memory: StrategyMemory) {
		// Update cache locally.
		const items = cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.updateSchedulingMemory(items, strategyId, schedulingId, memory)
			cache.set(accountId, data)
		}

		// Update database remotely.
		await this.database.UpdateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId, memory })
	}
}
