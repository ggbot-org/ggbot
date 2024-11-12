import { BinanceErrorCode, ErrorBinanceHTTP } from '@workspace/binance'
import { ExecutorDatabase, PublicDatabase } from '@workspace/database'
// TODO enable emails
// import { SendEmailProvider } from "@workspace/email-messages"
import { AccountStrategyKey, createdNow, ErrorAccountItemNotFound, ErrorStrategyItemNotFound, ErrorUnknownItem, frequencyIntervalDuration, isAccountKey, PRO_FREQUENCY_INTERVALS, StrategyScheduling } from '@workspace/models'
import { documentProvider } from '@workspace/s3-data-bucket'
import { now, Time, today, truncateTime } from 'minimal-time-helpers'

import { AccountKeysProvider } from './AccountKeysProvider.js'
import { AccountStrategiesProvider } from './AccountStrategiesProvider.js'
import { executeBinanceStrategy } from './executeBinanceStrategy.js'
import { StrategyFlowProvider } from './StrategyFlowProvider.js'
import { SubscriptionProvider } from './SubscriptionProvider.js'

export class Executor {
	readonly executorDatabase: ExecutorDatabase
	readonly accountKeysProvider: AccountKeysProvider
	readonly accountStrategiesProvider: AccountStrategiesProvider
	readonly subscriptionProvider: SubscriptionProvider
	readonly strategyFlowProvider: StrategyFlowProvider
	// TODO enable emails
	// readonly sendEmailProvider = new SendEmailProvider()

	strategyWhenExecuted = new Map<string, Time>()

	constructor() {
		const publicDatabase = new PublicDatabase(documentProvider)
		this.executorDatabase = new ExecutorDatabase(documentProvider)
		this.accountKeysProvider = new AccountKeysProvider(this.executorDatabase)
		this.accountStrategiesProvider = new AccountStrategiesProvider(this.executorDatabase)
		this.strategyFlowProvider = new StrategyFlowProvider(publicDatabase)
		this.subscriptionProvider = new SubscriptionProvider(this.executorDatabase)
	}

	/**
	 * Execute strategies if scheduling is active and according to scheduling frequency.
	 */
	async manageStrategyExecution({ accountId, strategyKind, strategyId }: AccountStrategyKey, scheduling: StrategyScheduling) {
		const { strategyWhenExecuted } = this
		const { status, frequency } = scheduling
		const schedulingId = scheduling.id
		if (status !== 'active') return
		const whenExecuted = strategyWhenExecuted.get(strategyId)
		const time = truncateTime(now()).to.minute
		if (whenExecuted) {
			const pauseDuration = frequencyIntervalDuration(frequency)
			if (whenExecuted + pauseDuration > time) return
		}
		strategyWhenExecuted.set(strategyId, time)

		if (strategyKind === 'binance') {
			try {
				const strategyFlow = await this.strategyFlowProvider.readStrategyFlow({ strategyId, strategyKind })
				if (!strategyFlow) throw new ErrorStrategyItemNotFound({ type: 'StrategyFlow', strategyId, strategyKind })

				const { memory, memoryChanged } = await executeBinanceStrategy(
					{ accountId, strategyId, strategyKind },
					scheduling,
					strategyFlow,
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

		if (strategyKind === 'none') return

		throw new ErrorUnknownItem('strategyKind', strategyKind)
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
					if (subscriptionPlan !== 'pro' && PRO_FREQUENCY_INTERVALS.includes(scheduling.frequency.interval)) {
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
					if (error.type === 'BinanceApiConfig') {
						this.accountKeysProvider.deleteCachedAccountId(accountId)
						continue
					}
				}

				// Fallback if error is not handled: should not arrive here.
				console.error(error)
			}
		}
	}
}
