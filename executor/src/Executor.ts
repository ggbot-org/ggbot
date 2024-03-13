import { BinanceErrorCode, ErrorBinanceHTTP } from "@workspace/binance"
import { CacheMap, ManagedCacheProvider } from "@workspace/cache"
import { ExecutorDatabase, PublicDatabase } from "@workspace/database"
import {
	AccountKey,
	AccountStrategy,
	AccountStrategyKey,
	AccountStrategySchedulingKey,
	createdNow,
	ErrorAccountItemNotFound,
	ErrorStrategyItemNotFound,
	ErrorUnknownItem,
	frequencyIntervalDuration,
	isAccountKey,
	isAccountStrategy,
	isSubscription,
	Item,
	itemIdCharacters,
	newId,
	PRO_FREQUENCY_INTERVALS,
	statusOfSubscription,
	StrategyMemory,
	StrategyScheduling,
	Subscription,
	SubscriptionPlan} from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"
import { now, Time, today, truncateTime } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"
import { homedir } from "os"
import { join } from "path"
import readFile from "read-file-utf8"
import writeFile from "write-file-utf8"

import { executeBinanceStrategy } from "./executeBinanceStrategy.js"
import { debug, info, warn } from "./logging.js"

const executorIdFile = join(homedir(), ".ggbot-executor")

const ONE_HOUR = 3_600_000

export class Executor {
	accountKeysCache = new CacheMap<AccountKey[]>(ONE_HOUR)
	accountStrategiesCache = new CacheMap<AccountStrategy[]>(ONE_HOUR)
	subscriptionsCache = new CacheMap<Subscription>(ONE_HOUR)

	readonly publicDatabase = new PublicDatabase(documentProvider)
	readonly executorDatabase = new ExecutorDatabase(documentProvider)

	// TODO should also write somewhere this info, in case server restarts.
	strategyWhenExecuted = new Map<string, Time>()

	constructor(
		readonly capacity: number,
		readonly index: number
	) {}

	get cachedAccountKeys(): ManagedCacheProvider<AccountKey[]> {
		const key = "accountKeys"
		return {
			get: (): AccountKey[] | undefined => this.accountKeysCache.get(key),
			set: (data: AccountKey[]): void =>
				this.accountKeysCache.set(key, data),
			delete: (accountId: AccountKey["accountId"]): void => {
				const items = this.accountKeysCache.get(key)
				if (!items) return
				const updatedItems = items.filter(
					(item) => item.accountId !== accountId
				)
				this.accountKeysCache.set(key, updatedItems)
			}
		}
	}

	/**
	 * Read `executorId` from local disc or create a new one if it does not
	 * exist.
	 */
	static async getExecutorId(): Promise<Item["id"]> {
		try {
			const executorId = await readFile(executorIdFile)
			return executorId
		} catch (error) {
			if (
				objectTypeGuard<{ code: string }>(
					({ code }) => typeof code === "string"
				)(error)
			) {
				const { code } = error
				if (code === "ENOENT") {
					const executorId = newId()
					await writeFile(executorIdFile, executorId)
					return executorId
				}
			}
			throw error
		}
	}

	static itemIdToNaturalNumber(itemId: Item["id"]) {
		const firstCharacter = itemId.charAt(0)
		for (let i = 0; i < itemIdCharacters.length; i++)
			if (itemIdCharacters.charAt(i) === firstCharacter) return i + 1
		throw new TypeError()
	}

	async getAccountKeys(): Promise<AccountKey[]> {
		try {
			const cached = this.cachedAccountKeys.get()
			if (cached) return cached
			const data = await this.executorDatabase.ListAccountKeys()
			this.cachedAccountKeys.set(data)
			return data
		} catch (error) {
			warn(error)
			return []
		}
	}

	async getAccountStrategies({
		accountId
	}: AccountKey): Promise<AccountStrategy[]> {
		const accountStrategies: AccountStrategy[] = []
		try {
			const key = accountId
			const { accountStrategiesCache: cache } = this
			const cached = cache.get(key)
			if (cached) return cached
			info("readAccountStrategies")
			const data =
				(await this.executorDatabase.ReadAccountStrategies({
					accountId
				})) ?? []
			if (!Array.isArray(data)) return accountStrategies
			for (const item of data)
				if (isAccountStrategy(item)) accountStrategies.push(item)
			cache.set(key, accountStrategies)
			return accountStrategies
		} catch (error) {
			warn(error)
			return accountStrategies
		}
	}

	/**
	 * Check if subscription is active.
	 *
	 * ```ts
	 * const { hasActiveSubscription, subscriptionPlan } =
	 * 	await this.checkSubscription({
	 * 		accountId
	 * 	})
	 * ```
	 */
	async checkSubscription({ accountId }: AccountKey): Promise<{
		hasActiveSubscription: boolean
		subscriptionPlan: SubscriptionPlan | undefined
	}> {
		try {
			const key = accountId
			const { subscriptionsCache: cache } = this
			const cached = cache.get(key)
			if (cached)
				return {
					hasActiveSubscription:
						statusOfSubscription(cached) === "active",
					subscriptionPlan: cached.plan
				}
			info("readSubscription", accountId)
			const subscription = await this.executorDatabase.ReadSubscription({
				accountId
			})
			if (!isSubscription(subscription))
				return {
					hasActiveSubscription: false,
					subscriptionPlan: undefined
				}
			cache.set(key, subscription)
			return {
				hasActiveSubscription:
					statusOfSubscription(subscription) === "active",
				subscriptionPlan: subscription.plan
			}
		} catch (error) {
			warn(error)
			return { hasActiveSubscription: false, subscriptionPlan: undefined }
		}
	}

	/**
	 * Execute strategies if scheduling is active and according to scheduling
	 * frequency.
	 */
	async manageStrategyExecution(
		{ accountId, strategyKind, strategyId }: AccountStrategyKey,
		scheduling: StrategyScheduling
	) {
		const { strategyWhenExecuted } = this
		const { status, frequency } = scheduling
		const schedulingId = scheduling.id
		if (status !== "active") return
		const whenExecuted = strategyWhenExecuted.get(strategyId)
		const time = truncateTime(now()).to.minute
		if (whenExecuted) {
			const pauseDuration = frequencyIntervalDuration(frequency)
			if (whenExecuted + pauseDuration > time) return
		}
		strategyWhenExecuted.set(strategyId, time)
		info("execute strategy", strategyId)

		if (strategyKind === "binance") {
			try {
				const { memory, memoryChanged } = await executeBinanceStrategy(
					{ accountId, strategyId },
					scheduling,
					this.publicDatabase,
					this.executorDatabase
				)
				if (memoryChanged) {
					await this.updateAccountStrategySchedulingMemory(
						{ accountId, strategyId, schedulingId },
						memory
					)
				}
			} catch (error) {
				if (error instanceof ErrorBinanceHTTP) {
					await this.executorDatabase.AppendStrategyDailyErrors({
						accountId,
						strategyId,
						strategyKind,
						day: today(),
						items: [{ error: error.toJSON(), ...createdNow() }]
					})

					const { code } = error.info.payload

					// TODO could check if the msg is related to funds
					// and handle it somehow instead of suspend the startegy
					// if (code === BinanceErrorCode.NEW_ORDER_REJECTED) return

					if (code === BinanceErrorCode.TIMEOUT) return
					if (code === BinanceErrorCode.SERVER_BUSY) return

					if (code === BinanceErrorCode.UNAUTHORIZED) {
						this.cachedAccountKeys.delete(accountId)
						return
					}

					// If error code is not handled, suspend startegy.
					await this.suspendAccountStrategyScheduling({
						accountId,
						strategyId,
						schedulingId
					})
					return
				}

				throw error
			}
			return
		}

		if (strategyKind === "none") return

		throw new ErrorUnknownItem("strategyKind", strategyKind)
	}

	managesItem(itemId: Item["id"]) {
		return (
			Executor.itemIdToNaturalNumber(itemId) % this.capacity ===
			this.index
		)
	}

	async runTasks() {
		const accountKeys = await this.getAccountKeys()
		for (const accountKey of accountKeys) {
			// Get account.
			if (!isAccountKey(accountKey)) continue
			const { accountId } = accountKey

			try {
				// Check subscription or suspend account strategies.
				const { hasActiveSubscription, subscriptionPlan } =
					await this.checkSubscription(accountKey)
				if (!hasActiveSubscription) {
					this.cachedAccountKeys.delete(accountId)
					continue
				}

				// Get strategies.
				const accountStrategies =
					await this.getAccountStrategies(accountKey)

				for (const {
					strategyId,
					strategyKind,
					schedulings
				} of accountStrategies)
					for (const scheduling of schedulings) {
						// Suspend scheduling if frequency interval is not allowed in subscription plan.
						if (
							subscriptionPlan !== "pro" &&
							PRO_FREQUENCY_INTERVALS.includes(
								scheduling.frequency.interval
							)
						) {
							await this.suspendAccountStrategyScheduling({
								accountId,
								strategyId,
								schedulingId: scheduling.id
							})
							continue
						}

						await this.manageStrategyExecution(
							{ accountId, strategyId, strategyKind },
							scheduling
						)
					}
			} catch (error) {
				if (error instanceof ErrorStrategyItemNotFound) {
					await this.suspendAccountStrategySchedulings({
						accountId,
						strategyId: error.strategyId
					})
					continue
				}

				if (error instanceof ErrorAccountItemNotFound) {
					if (error.type === "BinanceApiConfig") {
						this.cachedAccountKeys.delete(accountId)
						continue
					}
				}

				debug(error)
			}
		}
	}

	async suspendAccountStrategyScheduling({
		accountId,
		strategyId,
		schedulingId
	}: AccountStrategySchedulingKey) {
		warn(
			`Suspend strategy scheduling accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`
		)

		// Cleanup cache locally.
		this.accountStrategiesCache.delete(accountId)

		// Update database remotely.
		await this.executorDatabase.SuspendAccountStrategyScheduling({
			accountId,
			strategyId,
			schedulingId
		})
	}

	async suspendAccountStrategySchedulings({
		accountId,
		strategyId
	}: Pick<AccountStrategyKey, "accountId" | "strategyId">) {
		info(`Suspend strategy accountId=${accountId} strategyId=${strategyId}`)

		// Cleanup cache locally.
		this.accountStrategiesCache.delete(accountId)

		// Update database remotely.
		await this.executorDatabase.SuspendAccountStrategySchedulings({
			accountId,
			strategyId
		})
	}

	async updateAccountStrategySchedulingMemory(
		{ accountId, strategyId, schedulingId }: AccountStrategySchedulingKey,
		memory: StrategyMemory
	) {
		info(
			`Update strategy memory accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`
		)

		// Cleanup cache locally.
		this.accountStrategiesCache.delete(accountId)

		// Update database remotely.
		await this.executorDatabase.UpdateAccountStrategySchedulingMemory({
			accountId,
			strategyId,
			schedulingId,
			memory
		})
	}
}
