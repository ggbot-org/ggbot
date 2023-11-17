import { CacheMap, ManagedCacheProvider } from "@workspace/cache"
import {
	listAccountKeys,
	readAccountStrategies,
	readSubscription,
	suspendAccountStrategiesSchedulings,
	suspendAccountStrategyScheduling,
	suspendAccountStrategySchedulings,
	updateAccountStrategySchedulingMemory
} from "@workspace/database"
import {
	AccountKey,
	AccountStrategy,
	AccountStrategyKey,
	AccountStrategySchedulingKey,
	ErrorAccountItemNotFound,
	ErrorStrategyItemNotFound,
	ErrorUnimplementedStrategyKind,
	frequencyIntervalDuration,
	isAccountKey,
	isAccountStrategy,
	isSubscription,
	Item,
	itemIdCharacters,
	newId,
	statusOfSubscription,
	StrategyMemory,
	StrategyScheduling,
	Subscription
} from "@workspace/models"
import { now, Time, truncateTime } from "minimal-time-helpers"
import { homedir } from "os"
import { join } from "path"
import readFile from "read-file-utf8"
import writeFile from "write-file-utf8"

import { isNodeError } from "./errors.js"
import { executeBinanceStrategy } from "./executeBinanceStrategy.js"
import { info, warn } from "./logging.js"

const executorIdFile = join(homedir(), ".ggbot-executor")

export class Executor {
	accountKeysCache = new CacheMap<AccountKey[]>("ONE_HOUR")
	accountStrategiesCache = new CacheMap<AccountStrategy[]>("FIVE_MINUTES")
	subscriptionsCache = new CacheMap<Subscription>("ONE_HOUR")

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
			if (isNodeError(error)) {
				if (error.code === "ENOENT") {
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
			const data = await listAccountKeys()
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
			const data = (await readAccountStrategies({ accountId })) ?? []
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
	 * const hasActiveSubscription = await this.checkSubscription({
	 * 	accountId
	 * })
	 * ```
	 */
	async checkSubscription({ accountId }: AccountKey): Promise<boolean> {
		try {
			const key = accountId
			const { subscriptionsCache: cache } = this
			const cached = cache.get(key)
			if (cached) return statusOfSubscription(cached) === "active"
			info("readSubscription", accountId)
			const subscription = await readSubscription({ accountId })
			if (!isSubscription(subscription)) return false
			cache.set(key, subscription)
			return statusOfSubscription(subscription) === "active"
		} catch (error) {
			warn(error)
			return false
		}
	}

	/**
	 * Execute strategies if scheduling is active and accorging to scheduling
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
			const { memory, memoryChanged, success } =
				await executeBinanceStrategy(
					{ accountId, strategyId },
					scheduling
				)
			// Suspend strategy scheduling if execution failed.
			if (!success) {
				await this.suspendAccountStrategyScheduling({
					accountId,
					strategyId,
					schedulingId
				})
				return
			}
			if (memoryChanged) {
				await this.updateAccountStrategySchedulingMemory(
					{ accountId, strategyId, schedulingId },
					memory
				)
				return
			}
		}
		throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId })
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
			try {
				// Get account.
				if (!isAccountKey(accountKey)) continue
				const { accountId } = accountKey

				// Check subscription or suspend account strategies.
				const hasActiveSubscription =
					await this.checkSubscription(accountKey)
				if (!hasActiveSubscription) {
					await this.suspendAccountStrategies(accountKey)
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
						await this.manageStrategyExecution(
							{ accountId, strategyId, strategyKind },
							scheduling
						)
					}
			} catch (error) {
				if (
					error instanceof ErrorUnimplementedStrategyKind ||
					error instanceof ErrorStrategyItemNotFound
				) {
					await this.suspendAccountStrategySchedulings({
						accountId: accountKey.accountId,
						strategyId: error.strategyId
					})
					continue
				}

				if (error instanceof ErrorAccountItemNotFound) {
					if (error.type === "BinanceApiConfig") {
						await this.suspendAccountStrategies(accountKey)
						continue
					}
				}

				warn(error)
				continue
			}
		}
	}

	async suspendAccountStrategies({ accountId }: AccountKey) {
		info(`Suspend all strategies accountId=${accountId}`)

		// Cleanup cache locally.
		this.cachedAccountKeys.delete(accountId)
		this.accountStrategiesCache.delete(accountId)

		// Update database remotely.
		await suspendAccountStrategiesSchedulings({ accountId })
	}

	async suspendAccountStrategyScheduling({
		accountId,
		strategyId,
		schedulingId
	}: AccountStrategySchedulingKey) {
		info(
			`Suspend strategy scheduling accountId=${accountId} strategyId=${strategyId} schedulingId=${schedulingId}`
		)

		// Cleanup cache locally.
		this.accountStrategiesCache.delete(accountId)

		// Update database remotely.
		await suspendAccountStrategyScheduling({
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
		await suspendAccountStrategySchedulings({
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
		await updateAccountStrategySchedulingMemory({
			accountId,
			strategyId,
			schedulingId,
			memory
		})
	}
}
