import { BinanceErrorCode, ErrorBinanceHTTP } from "@workspace/binance"
import { ExecutorDatabase, PublicDatabase } from "@workspace/database"
// TODO enable emails
// import { SendEmailProvider } from "@workspace/email-messages"
import { AccountStrategyKey, createdNow, ErrorAccountItemNotFound, ErrorStrategyItemNotFound, ErrorUnknownItem, frequencyIntervalDuration, isAccountKey, Item, itemIdCharacters, newId, PRO_FREQUENCY_INTERVALS, StrategyScheduling } from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"
import { now, Time, today, truncateTime } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"
import { homedir } from "os"
import { join } from "path"
import readFile from "read-file-utf8"
import writeFile from "write-file-utf8"

import { AccountKeysProvider } from "./AccountKeysProvider.js"
import { AccountStrategiesProvider } from "./AccountStrategiesProvider.js"
import { executeBinanceStrategy } from "./executeBinanceStrategy.js"
import { debug, info } from "./logging.js"
import { SubscriptionProvider } from "./SubscriptionProvider.js"

const executorIdFile = join(homedir(), ".ggbot-executor")

export class Executor {
	capacity: number
	index: number
	readonly publicDatabase: PublicDatabase
	readonly executorDatabase: ExecutorDatabase
	readonly accountKeysProvider: AccountKeysProvider
	readonly accountStrategiesProvider: AccountStrategiesProvider
	readonly subscriptionProvider: SubscriptionProvider
	// TODO enable emails
	// readonly sendEmailProvider = new SendEmailProvider()

	strategyWhenExecuted = new Map<string, Time>()

	constructor(capacity: number, index: number) {
		this.capacity = capacity
		this.index = index
		this.publicDatabase = new PublicDatabase(documentProvider)
		this.executorDatabase = new ExecutorDatabase(documentProvider)
		this.accountKeysProvider = new AccountKeysProvider(this.executorDatabase)
		this.accountStrategiesProvider = new AccountStrategiesProvider(this.executorDatabase)
		this.subscriptionProvider = new SubscriptionProvider(this.executorDatabase)
	}

	/**
	 * Read `executorId` from local disc or create a new one if it does not exist.
	 */
	static async getExecutorId(): Promise<Item["id"]> {
		try {
			const executorId = await readFile(executorIdFile)
			info("executorId", executorId)
			return executorId
		} catch (error) {
			if (objectTypeGuard<{ code: string }>(
				({ code }) => typeof code === "string"
			)(error)) {
				if (error.code === "ENOENT") {
					const executorId = newId()
					info("new executorId", executorId)
					await writeFile(executorIdFile, executorId)
					return executorId
				}
			}
			throw error
		}
	}

	static itemIdToNaturalNumber(itemId: Item["id"]) {
		const firstCharacter = itemId.charAt(0)
		for (let i = 0; i < itemIdCharacters.length; i++) {
			if (itemIdCharacters.charAt(i) === firstCharacter) return i + 1
		}
		throw new TypeError()
	}

	/**
	 * Execute strategies if scheduling is active and according to scheduling frequency.
	 */
	async manageStrategyExecution({ accountId, strategyKind, strategyId }: AccountStrategyKey, scheduling: StrategyScheduling) {
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
					{ accountId, strategyId, strategyKind },
					scheduling,
					this.publicDatabase,
					this.executorDatabase
				)
				if (memoryChanged) {
					await this.accountStrategiesProvider.updateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId }, memory)
				}
			} catch (error) {
				if (error instanceof ErrorBinanceHTTP) {
					await this.executorDatabase.AppendStrategyDailyErrors({
						accountId, strategyId, strategyKind,
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
						this.accountKeysProvider.deleteCachedAccountId(accountId)
						return
					}

					// If error code is not handled, suspend startegy.
					await this.accountStrategiesProvider.suspendAccountStrategyScheduling({
						accountId, strategyId, schedulingId
					}
						// TODO enable emails
						// strategyKind
					)
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
		return Executor.itemIdToNaturalNumber(itemId) % this.capacity === this.index
	}

	async runTasks() {
		const accountKeys = await this.accountKeysProvider.getAccountKeys()
		for (const accountKey of accountKeys) {
			// Get account.
			if (!isAccountKey(accountKey)) continue
			const { accountId } = accountKey

			try {
				// Check subscription or suspend account strategies.

				const { hasActiveSubscription, subscriptionPlan } = await this.subscriptionProvider.checkSubscription(accountKey)

				if (!hasActiveSubscription) {
					// Cleanup cache.
					this.accountKeysProvider.deleteCachedAccountId(accountId)
					continue
				}

				// Get strategies.
				const accountStrategies = await this.accountStrategiesProvider.getAccountStrategies(accountKey)

				for (
					const { strategyId, strategyKind, schedulings } of accountStrategies
				) for (const scheduling of schedulings) {
					// Suspend scheduling if frequency interval is not allowed in subscription plan.
					if (subscriptionPlan !== "pro" && PRO_FREQUENCY_INTERVALS.includes(scheduling.frequency.interval)) {
						// TODO enable emails
						// pass strategyKind
						await this.accountStrategiesProvider.suspendAccountStrategyScheduling({ accountId, strategyId, schedulingId: scheduling.id })
						continue
					}

					await this.manageStrategyExecution({ accountId, strategyId, strategyKind }, scheduling)
				}
			} catch (error) {
				if (error instanceof ErrorStrategyItemNotFound) {
					await this.accountStrategiesProvider.suspendAccountStrategySchedulings({ accountId, strategyId: error.strategyId })
					continue
				}

				if (error instanceof ErrorAccountItemNotFound) {
					if (error.type === "BinanceApiConfig") {
						this.accountKeysProvider.deleteCachedAccountId(accountId)
						continue
					}
				}

				debug(error)
			}
		}
	}
}
