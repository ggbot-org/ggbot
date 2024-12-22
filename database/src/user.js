import {CacheMap} from '@workspace/cache'
import {accountStrategiesModifier, ErrorAccountItemNotFound, ErrorPermissionOnStrategyItem, ErrorStrategyItemNotFound, frequenciesAreEqual, newAccountStrategy, newStrategyFlow, welcomeFlow} from '@workspace/models'
import {dateToDay, dayToDate, getDate} from 'minimal-time-helpers'

import {newId} from "./item.js";
import {createdNow, deletedNow, updatedNow} from "./time.js";
import {BinanceDatabase} from './binance.js'
import {pathname} from './locators.js'
import {PublicDatabase} from './public.js'

const strategyAccountIdCache = new CacheMap(86_400_000) // 1 day

/**
 * @typedef {import('@workspace/api').DocumentProviderLevel2} DocumentProviderLevel2
 * @typedef {import('@workspace/api').UserDatabaseAction} UserDatabaseAction
 * @typedef {import('@workspace/api').UserDatabaseActionOutput} Output
 */

/**
 * @typedef {import('@workspace/models').Account} Account
 * @typedef {import('@workspace/models').AccountDailyKey} AccountDailyKey
 * @typedef {import('@workspace/models').AccountKey} AccountKey
 * @typedef {import('@workspace/models').AccountStrategy} AccountStrategy
 * @typedef {import('@workspace/models').AccountStrategyDailyKey} AccountStrategyDailyKey
 * @typedef {import('@workspace/models').BalanceEvent} BalanceEvent
 * @typedef {import('@workspace/models').Frequency} Frequency
 * @typedef {import('@workspace/models').Order} Order
 * @typedef {import('@workspace/models').Strategy} Strategy
 * @typedef {import('@workspace/models').StrategyError} StrategyError
 * @typedef {import('@workspace/models').StrategyFlow} StrategyFlow
 * @typedef {import('@workspace/models').StrategyKey} StrategyKey
 */

/**
 * @param {import('@workspace/models').NewItem<Strategy>} arg
 * @returns {Strategy}
 */
function newStrategy({name, ...rest}) {
	return {
		id: newId(),
		name,
		...rest,
		...createdNow()
	};
}

/** @implements {UserDatabaseAction} */
export class UserDatabase {
	/**
	 * @param {AccountKey} accountKey
	 * @param {DocumentProviderLevel2} documentProvider
	 */
	constructor(accountKey, documentProvider) {
		this.accountKey = accountKey
		this.binanceDatabase = new BinanceDatabase(accountKey, documentProvider)
		this.publicDatabase = new PublicDatabase(documentProvider)
		this.documentProvider = documentProvider
	}

	/** @type {import('./user').UserDatabase['CopyStrategy']} */
	async CopyStrategy({strategyId, strategyKind, name}) {
		const {accountId} = this.accountKey
		const sourceStrategy = await this.readStrategy({strategyId, strategyKind})
		const targetStrategy = newStrategy({name, kind: strategyKind, accountId, frequency: sourceStrategy.frequency})
		const targetStrategyKey = {strategyId: targetStrategy.id, strategyKind}
		await this.documentProvider.setItem(pathname.strategy(targetStrategyKey), targetStrategy)
		const sourceStrategyFlow = await this.readStrategyFlow({strategyId, strategyKind})
		await this.documentProvider.setItem(pathname.strategyFlow(targetStrategyKey), sourceStrategyFlow)
		const accountStrategy = newAccountStrategy({name, ...targetStrategyKey})
		await this.insertAccountStrategiesItem(accountStrategy)
		return targetStrategyKey
	}

	/** @type {import('./user').UserDatabase['CreateBinanceApiConfig']} */
	async CreateBinanceApiConfig(arg) {
		await this.documentProvider.setItem(pathname.binanceApiConfig(this.accountKey), arg)
		return createdNow()
	}

	CreatePurchaseOrder() {
		// TODO ??
		return Promise.resolve(null)
	}

	/** @type {import('./user').UserDatabase['CreateStrategy']} */
	async CreateStrategy({name, ...rest}) {
		const {accountId} = this.accountKey
		const strategy = newStrategy({name, accountId, ...rest})
		const strategyKey = {strategyId: strategy.id, strategyKind: strategy.kind}
		await this.documentProvider.setItem(pathname.strategy(strategyKey), strategy)
		await this.documentProvider.setItem(pathname.strategyFlow(strategyKey), newStrategyFlow({view: welcomeFlow}))
		const accountStrategy = newAccountStrategy({name, ...strategyKey})
		await this.insertAccountStrategiesItem(accountStrategy)
		return strategyKey
	}

	async DeleteAccount() {
		await this.DeleteBinanceApiConfig()
		await this.documentProvider.removeItem(pathname.account(this.accountKey))
		return deletedNow()
	}

	async DeleteBinanceApiConfig() {
		await this.documentProvider.removeItem(pathname.binanceApiConfig(this.accountKey))
		return deletedNow()
	}

	/** @type {import('./user').UserDatabase['DeleteStrategy']} */
	async DeleteStrategy(strategyKey) {
		await this.deleteAccountStrategiesItem(strategyKey.strategyId)
		await this.deleteStrategyFlow(strategyKey)
		return deletedNow()
	}

	async ReadAccountInfo() {
		const account = await this.readAccount()
		const subscription = await this.ReadSubscription()
		return {subscription, ...account}
	}

	/** @type {import('./user').UserDatabase['ReadBalances']} */
	async ReadBalances({start, end}) {
		const result = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readAccountDailyBalanceEvents({day: dateToDay(date), ...this.accountKey})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	async ReadBinanceApiKey() {
		const data = await this.binanceDatabase.ReadBinanceApiConfig()
		if (!data) return null
		const {apiKey} = data
		return {apiKey}
	}

	/** @type {import('./user').UserDatabase['ReadStrategies']} */
	async ReadStrategies() {
		const data = await this.documentProvider.getItem(pathname.accountStrategies(this.accountKey))
		return /**  @type {Output['ReadStrategies']} */ (data ?? [])
	}

	/** @type {import('./user').UserDatabase['ReadStrategyErrors']} */
	async ReadStrategyErrors({start, end, ...strategyKey}) {
		const result = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readStrategyDailyErrors({day: dateToDay(date), ...this.accountKey, ...strategyKey})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	/** @type {import('./user').UserDatabase['ReadStrategyOrders']} */
	async ReadStrategyOrders({start, end, ...strategyKey}) {
		const result = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readStrategyDailyOrders({day: dateToDay(date), ...this.accountKey, ...strategyKey})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	/** @type {import('./user').UserDatabase['ReadSubscription']} */
	ReadSubscription() {
		return this.documentProvider.getItem(pathname.subscription(this.accountKey))
	}

	/** @type {import('./user').UserDatabase['RenameStrategy']} */
	async RenameStrategy({name: newName, strategyId, strategyKind}) {
		const {name: oldName, ...strategy} = await this.readStrategy({strategyId, strategyKind})
		if (newName === oldName) return updatedNow()
		await this.writeStrategy({name: newName, ...strategy})
		const accountStrategies = await this.ReadStrategies()
		const data = accountStrategies.map((item) => {
			if (item.strategyId !== strategyId) return item
			return {...item, name: newName}
		})
		return this.writeAccountStrategies(data)
	}

	/** @type {import('./user').UserDatabase['WriteAccountStrategiesItemSchedulings']} */
	async WriteAccountStrategiesItemSchedulings({schedulings, strategyId, strategyKind}) {
		const items = await this.ReadStrategies()
		const data = []
		let suggestedFrequency
		for (const item of items) {
			if (item.strategyId !== strategyId) {
				data.push(item)
				continue
			}
			data.push({...item, schedulings})
			// Use first frequency as `suggestedFrequency`.
			suggestedFrequency = schedulings[0]?.frequency
		}
		if (suggestedFrequency) await this.upsertStrategyFrequency({strategyId, strategyKind, frequency: suggestedFrequency})
		return this.documentProvider.setItem(pathname.accountStrategies(this.accountKey), data)
	}

	/** @type {import('./user').UserDatabase['WriteStrategyFlow']} */
	async WriteStrategyFlow({view, strategyId, strategyKind}) {
		return this.writeStrategyFlow({strategyId, strategyKind, view, ...updatedNow()})
	}

	/** @param {StrategyKey} strategyKey */
	async deleteStrategyFlow(strategyKey) {
		const {accountId} = this.accountKey
		const ownerId = await this.readStrategyAccountId(strategyKey)
		if (accountId !== ownerId) {
			throw new ErrorPermissionOnStrategyItem({type: 'StrategyFlow', action: 'delete', accountId, ...strategyKey})
		}
		await this.documentProvider.removeItem(pathname.strategyFlow(strategyKey))
	}

	/** @param {AccountStrategy} item */
	async insertAccountStrategiesItem(item) {
		const {accountId} = this.accountKey
		const items = await this.ReadStrategies()
		const subscription = await this.ReadSubscription()
		const newItems = accountStrategiesModifier.insertAccountStrategy(items, item, subscription?.plan)
		await this.documentProvider.setItem(pathname.accountStrategies({accountId}), newItems)
	}

	/** @param {AccountStrategy['strategyId']} strategyId */
	async deleteAccountStrategiesItem(strategyId) {
		const {accountId} = this.accountKey
		const items = await this.ReadStrategies()
		const newItems = accountStrategiesModifier.deleteAccountStrategy(items, strategyId)
		await this.documentProvider.setItem(pathname.accountStrategies({accountId}), newItems)
	}

	async readAccount() {
		const {accountId} = this.accountKey
		const account = await this.documentProvider.getItem(pathname.account({accountId}))
		if (!account) throw new ErrorAccountItemNotFound({type: 'Account', accountId})
		return /** @type {Account} */ (account)
	}

	/** @param {AccountDailyKey} arg */
	async readAccountDailyBalanceEvents(arg) {
		const data = await this.documentProvider.getItem(pathname.accountDailyBalanceEvents(arg))
		return /** @type {BalanceEvent[]} */ (data ?? [])
	}

	/** @param {StrategyKey} strategyKey */
	async readStrategy(strategyKey) {
		const data = await this.publicDatabase.ReadStrategy(strategyKey)
		if (!data) throw new ErrorStrategyItemNotFound({type: 'Strategy', ...strategyKey})
		return data
	}

	/** @param {StrategyKey} strategyKey */
	async readStrategyAccountId(strategyKey) {
		const {strategyId} = strategyKey
		const cachedData = strategyAccountIdCache.get(strategyId)
		if (cachedData) return cachedData
		const {accountId} = await this.readStrategy(strategyKey)
		strategyAccountIdCache.set(strategyId, accountId)
		return accountId
	}

	/** @param {AccountStrategyDailyKey} arg */
	async readStrategyDailyErrors(arg) {
		const data = await this.documentProvider.getItem(pathname.strategyDailyErrors(arg))
		return /** @type {StrategyError[]} */ (data ?? [])
	}

	/** @param {AccountStrategyDailyKey} arg */
	async readStrategyDailyOrders(arg) {
		const data = await this.documentProvider.getItem(pathname.strategyDailyOrders(arg))
		return /** @type {Order[]} */ (data ?? [])
	}

	/** @param {StrategyKey} strategyKey */
	async readStrategyFlow(strategyKey) {
		const data = await this.publicDatabase.ReadStrategyFlow(strategyKey)
		if (!data) throw new ErrorStrategyItemNotFound({type: 'StrategyFlow', ...strategyKey})
		return data
	}

	/** @param {AccountStrategy[]} data */
	writeAccountStrategies(data) {
		return this.documentProvider.setItem(pathname.accountStrategies(this.accountKey), data)
	}

	/** @param {StrategyKey & {frequency: Frequency}} arg */
	async upsertStrategyFrequency({frequency, ...strategyKey}) {
		const strategy = await this.readStrategy(strategyKey)
		if (frequenciesAreEqual(frequency, strategy.frequency)) return
		await this.writeStrategy({...strategy, frequency})
	}

	/** @param {Strategy} strategy */
	async writeStrategy(strategy) {
		const {accountId} = this.accountKey
		const {id: strategyId, kind: strategyKind} = strategy
		if (accountId !== strategy.accountId) {
			throw new ErrorPermissionOnStrategyItem({type: 'Strategy', action: 'write', accountId, strategyId, strategyKind})
		}
		return this.documentProvider.setItem(pathname.strategy({strategyId, strategyKind}), strategy)
	}

	/** @param {StrategyKey & StrategyFlow} arg */
	async writeStrategyFlow({strategyId, strategyKind, ...data}) {
		const {accountId} = this.accountKey
		const ownerId = await this.readStrategyAccountId({strategyId, strategyKind})
		if (accountId !== ownerId) {
			throw new ErrorPermissionOnStrategyItem({type: 'StrategyFlow', action: 'write', accountId, strategyId, strategyKind})
		}
		return this.documentProvider.setItem(pathname.strategyFlow({strategyId, strategyKind}), data)
	}
}
