import { CacheMap } from "@workspace/cache"
import { ExecutorDatabase } from "@workspace/database"
import { AccountKey, accountStrategiesModifier, AccountStrategy, AccountStrategyKey, AccountStrategySchedulingKey, isAccount, isAccountStrategy, StrategyMemory } from "@workspace/models"

import { ONE_HOUR } from "./durations.js"
import { info, warn } from "./logging.js"

export class AccountStrategiesProvider {
	readonly cache: CacheMap<AccountStrategy[]>
	readonly database: ExecutorDatabase

	constructor(database: ExecutorDatabase) {
		this.cache = new CacheMap<AccountStrategy[]>(ONE_HOUR)
		this.database = database
	}

	async getAccountStrategies({ accountId }: AccountKey): Promise<AccountStrategy[]> {
		const accountStrategies: AccountStrategy[] = []
		try {
			const cached = this.cache.get(accountId)
			if (cached) return cached
			info("readAccountStrategies")
			const data = (await this.database.ReadAccountStrategies({ accountId })) ?? []
			if (!Array.isArray(data)) return accountStrategies
			for (const item of data) if (isAccountStrategy(item)) accountStrategies.push(item)
			this.cache.set(accountId, accountStrategies)
			return accountStrategies
		} catch (error) {
			warn(error)
			return accountStrategies
		}
	}

	async suspendAccountStrategyScheduling(
		{ accountId, strategyId, schedulingId }: AccountStrategySchedulingKey
		// The `strategyKind` is needed to send email notification.
		// TODO enable emails
		// strategyKind: StrategyKind
	) {
		warn(`Suspend strategy scheduling accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`)

		// Update cache locally.
		const items = this.cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.suspendScheduling(items, strategyId, schedulingId)
			this.cache.set(accountId, data)
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
		info(`Suspend strategy accountId=${accountId} strategyId=${strategyId}`)

		// Update cache locally.
		const items = this.cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.suspendStrategySchedulings(items, strategyId)
			this.cache.set(accountId, data)
		}

		// Update database remotely.
		await this.database.SuspendAccountStrategySchedulings({ accountId, strategyId })
	}

	async updateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId }: AccountStrategySchedulingKey, memory: StrategyMemory) {
		info(`Update strategy memory accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`)

		// Update cache locally.
		const items = this.cache.get(accountId)
		if (items) {
			const data = accountStrategiesModifier.updateSchedulingMemory(items, strategyId, schedulingId, memory)
			this.cache.set(accountId, data)
		}

		// Update database remotely.
		await this.database.UpdateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId, memory })
	}
}
