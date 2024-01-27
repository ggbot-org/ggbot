import {
	UserAction,
	UserActionInput as Input,
	UserActionOutput as Output,
	DocumentProviderLevel2,
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	AccountKey,
	AccountStrategy,
	ErrorAccountItemNotFound,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	Order,
	StrategyDailyOrdersKey,
	StrategyFlow,
	StrategyKey,
	UpdateTime,
	accountStrategiesModifier,
	createdNow,
	deletedNow,
	newAccountStrategy,
	newStrategy,
	updatedNow
} from "@workspace/models"
import { BinanceDatabase } from "./binance.js"
import { PublicDatabase } from "./public.js"
import { pathname } from "./locators.js"
import {dateToDay, dayToDate, getDate} from "minimal-time-helpers"

export class UserDatabase implements UserAction {
	readonly accountKey: AccountKey
	readonly documentProvider: DocumentProviderLevel2
	readonly binanceDatabase: BinanceDatabase
	readonly publicDatabase: PublicDatabase
	// TODO cache should be attached after to the instance, to be reused
	readonly strategyAccountIdCache = new CacheMap<Account["id"]>()

	constructor(
		accountKey: UserDatabase["accountKey"],
		documentProvider: UserDatabase["documentProvider"]
	) {
		this.accountKey = accountKey
		this.binanceDatabase = new BinanceDatabase(accountKey, documentProvider)
		this.publicDatabase = new PublicDatabase(documentProvider)
		this.documentProvider = documentProvider
	}

	async CopyStrategy({
		strategyId,
		strategyKind,
		name
	}: Input["CopyStrategy"]) {
		const strategy = await this.readStrategy({ strategyId, strategyKind })
		const newStrategy = await this.CreateStrategy({
			kind: strategyKind,
			name,
			frequency: strategy.frequency
		})
		await this.copyStrategyFlow(
			{ strategyId, strategyKind },
			{ strategyId: newStrategy.id, strategyKind: newStrategy.kind }
		)
		return newStrategy
	}

	async CreateBinanceApiConfig (arg: Input['CreateBinanceApiConfig'])  {
		await this.documentProvider.setItem(pathname.binanceApiConfig(this.accountKey), arg)
		return createdNow()
	}

	async CreateStrategy({
		name,
		...rest
	}: Input["CreateStrategy"]) {
		const { accountId } = this.accountKey
		const strategy = newStrategy({
			name,
			accountId,
			...rest
		})
		const { id: strategyId, kind: strategyKind } = strategy
		this.documentProvider.setItem(
			pathname.strategy({ strategyId, strategyKind }),
			strategy
		)
		const accountStrategy = newAccountStrategy({
			name,
			strategyId,
			strategyKind
		})
		await this.insertAccountStrategiesItem(accountStrategy)
		return strategy
	}

	DeleteAccount() {
		return this.documentProvider.removeItem(pathname.account(this.accountKey))
	}

	async DeleteBinanceApiConfig() {
		await this.documentProvider.removeItem(pathname.binanceApiConfig(this.accountKey))
		return deletedNow()
	}

	async DeleteStrategy(strategyKey: Input['DeleteStrategy']) {
		await this.deleteStrategy(strategyKey)
		await this.deleteStrategyFlow(strategyKey)
		return deletedNow()
	}

	ReadAccountStrategies(){
		return this.documentProvider.getItem<Output["ReadAccountStrategies"]>(
			pathname.accountStrategies(this.accountKey)
		)
	}

	async ReadBinanceApiKey() {
		const data = await this.binanceDatabase.ReadBinanceApiConfig()
	if (!data) return null
	const { apiKey } = data
	return { apiKey }
	}

	async ReadStrategyOrders({start, end, ...strategyKey}: Input['ReadStrategyOrders']) {
		const {accountId} = this.accountKey
		const result: Output['ReadStrategyOrders'] = []
	let date = dayToDate(start)
	while (date <= dayToDate(end)) {
		const day = dateToDay(date)
		const orders = await this.readStrategyDailyOrders({ day, accountId, ...strategyKey }) ?? []
		if (!orders) continue
		for (const order of orders) result.push(order)
		date = getDate(date).plusOne.day
	}
	return result

	}

	ReadSubscription() {
		return this.documentProvider.getItem<Output['ReadSubscription']>(
			pathname.subscription(this.accountKey)
		)
	}

	async RenameAccount ({name}: Input['RenameAccount']) {
		const account = await this.readAccount()
	const data: Account = {
		...account,
		name
	}
	return this.documentProvider.setItem(pathname.account(this.accountKey), data)
	}

	async SetAccountCountry({country}: Input['SetAccountCountry']) {
		const account = await this.readAccount()
	const data: Account = {
		...account,
		country
	}
return this.documentProvider.setItem(pathname.account(this.accountKey), data)
	}

	async WriteStrategyFlow({
		view,
		strategyId,
		strategyKind
	}: Input["WriteStrategyFlow"]) {
		return this.writeStrategyFlow({ strategyId, strategyKind, view, ...updatedNow() })
	}

	 async copyStrategyFlow(source: StrategyKey, target: StrategyKey) {
		const data = await this.readStrategyFlow(source)
		await this.writeStrategyFlow({ ...target, ...data })
	}

	 async deleteStrategy(strategyKey: StrategyKey) {
		const { accountId } = this.accountKey
		const ownerId = await this.readStrategyAccountId(strategyKey)
		if (accountId !== ownerId)
			throw new ErrorPermissionOnStrategyItem({
				type: "Strategy",
				action: "delete",
				accountId,
				...strategyKey
			})
		await this.documentProvider.removeItem(pathname.strategy(strategyKey))
	}

	 async deleteStrategyFlow(strategyKey: StrategyKey) {
		const { accountId } = this.accountKey
		const ownerId = await this.readStrategyAccountId(strategyKey)
		if (accountId !== ownerId)
			throw new ErrorPermissionOnStrategyItem({
				type: "StrategyFlow",
				action: "delete",
				accountId,
				...strategyKey
			})
		await this.documentProvider.removeItem(
			pathname.strategyFlow(strategyKey)
		)
	}

	 async insertAccountStrategiesItem(item: AccountStrategy) {
		const { accountId } = this.accountKey
		const items = await this.ReadAccountStrategies() ?? []
		const subscription = await this.ReadSubscription()
		const newItems = accountStrategiesModifier.insertItem(
			items,
			item,
			subscription?.plan
		)
		this.documentProvider.setItem(
			pathname.accountStrategies({ accountId }),
			newItems
		)
	}

	 async readAccount () {
		const {accountId} = this.accountKey
		const account = await this.documentProvider.getItem<Account>(pathname.account({accountId}))
	if (!account)
		throw new ErrorAccountItemNotFound({ type: "Account", accountId })
	return account
	}

	 async readStrategy(strategyKey: StrategyKey) {
		const data = await this.publicDatabase.ReadStrategy(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "Strategy",
				...strategyKey
			})
		return data
	}

	 async readStrategyAccountId(
		strategyKey: StrategyKey
	): Promise<Account["id"] | null> {
		const { strategyAccountIdCache: cache } = this
		const { strategyId } = strategyKey
		const cachedData = cache.get(strategyId)
		if (cachedData) return cachedData
		const { accountId } = await this.readStrategy(strategyKey)
		cache.set(strategyId, accountId)
		return accountId
	}

 readStrategyDailyOrders( arg: StrategyDailyOrdersKey) {
	return this.documentProvider.getItem<Order[] | null>(pathname.strategyDailyOrders(arg)) 
}

	 async readStrategyFlow( strategyKey: StrategyKey) {
		const data = await this.publicDatabase.ReadStrategyFlow(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "StrategyFlow",
				...strategyKey
			})
		return data
	}

	 async writeStrategyFlow({
		strategyId,
		strategyKind,
		...data
	}: StrategyKey & StrategyFlow) {
		const { accountId } = this.accountKey
		const ownerId = await this.readStrategyAccountId({
			strategyId,
			strategyKind
		})
		if (accountId !== ownerId)
			throw new ErrorPermissionOnStrategyItem({
				type: "StrategyFlow",
				action: "write",
				accountId,
				strategyId,
				strategyKind
			})
		return this.documentProvider.setItem(
			pathname.strategyFlow({ strategyId, strategyKind }),
			data
		)
	}
}
