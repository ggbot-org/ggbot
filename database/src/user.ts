import {
	DocumentProviderLevel2,
	UserActionInput as Input,
	UserActionOutput as Output,
	UserDataprovider
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	AccountKey,
	AccountStrategy,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	Order,
	StrategyDailyOrdersKey,
	StrategyFlow,
	StrategyKey,
	accountStrategiesModifier,
	deletedNow,
	newAccountStrategy,
	newStrategy,
	updatedNow
} from "@workspace/models"
import { PublicDatabase } from "./public.js"
import { pathname } from "./locators.js"
import {dateToDay, dayToDate, getDate} from "minimal-time-helpers"

export class UserDatabase implements UserDataprovider {
	readonly accountKey: AccountKey
	readonly documentProvider: DocumentProviderLevel2
	readonly publicDatabase: PublicDatabase
	readonly strategyAccountIdCache = new CacheMap<Account["id"]>()

	constructor(
		accountKey: UserDatabase["accountKey"],
		publicDatabase: UserDatabase["publicDatabase"],
		documentProvider: UserDatabase["documentProvider"]
	) {
		this.accountKey = accountKey
		this.publicDatabase = publicDatabase
		this.documentProvider = documentProvider
	}

	async CopyStrategy({
		strategyId,
		strategyKind,
		name
	}: Input["CopyStrategy"]): Promise<Output["CopyStrategy"]> {
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

	async CreateStrategy({
		name,
		...rest
	}: Input["CreateStrategy"]): Promise<Output["CreateStrategy"]> {
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

	async DeleteStrategy({
		strategyId,
		strategyKind
	}: Input["DeleteStrategy"]): Promise<Output["DeleteStrategy"]> {
		await this.deleteStrategy({ strategyId, strategyKind })
		return deletedNow()
	}

	ReadAccountStrategies(){
		return this.documentProvider.getItem<Output["ReadAccountStrategies"]>(
			pathname.accountStrategies(this.accountKey)
		)
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

	async WriteStrategyFlow({
		view,
		strategyId,
		strategyKind
	}: Input["WriteStrategyFlow"]) {
		const time = updatedNow()
		this.writeStrategyFlow({ strategyId, strategyKind, view, ...time })
		return time
	}

	private async copyStrategyFlow(source: StrategyKey, target: StrategyKey) {
		const data = await this.readStrategyFlow(source)
		await this.writeStrategyFlow({ ...target, ...data })
	}

	private async deleteStrategy(strategyKey: StrategyKey) {
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

	// TODO remove it if not needed
	// private async deleteStrategyFlow(strategyKey: StrategyKey) {
	// 	const { accountId } = this.accountKey
	// 	const ownerId = await this.readStrategyAccountId(strategyKey)
	// 	if (accountId !== ownerId)
	// 		throw new ErrorPermissionOnStrategyItem({
	// 			type: "StrategyFlow",
	// 			action: "delete",
	// 			accountId,
	// 			...strategyKey
	// 		})
	// 	await this.documentProvider.removeItem(
	// 		pathname.strategyFlow(strategyKey)
	// 	)
	// }

	private async insertAccountStrategiesItem(item: AccountStrategy) {
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

	private async readStrategy(strategyKey: StrategyKey) {
		const data = await this.publicDatabase.ReadStrategy(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "Strategy",
				...strategyKey
			})
		return data
	}

	private async readStrategyAccountId(
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

private readStrategyDailyOrders( arg: StrategyDailyOrdersKey) {
	return this.documentProvider.getItem<Order[] | null>(pathname.strategyDailyOrders(arg)) 
}

	private async readStrategyFlow( strategyKey: StrategyKey) {
		const data = await this.publicDatabase.ReadStrategyFlow(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "StrategyFlow",
				...strategyKey
			})
		return data
	}

	private async writeStrategyFlow({
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
		this.documentProvider.setItem(
			pathname.strategyFlow({ strategyId, strategyKind }),
			data
		)
	}
}
