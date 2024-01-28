import {
	DocumentProviderLevel2,
	UserAction,
	UserActionInput as Input,
	UserActionOutput as Output
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	AccountKey,
	accountStrategiesModifier,
	AccountStrategy,
	createdNow,
	deletedNow,
	ErrorAccountItemNotFound,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	frequenciesAreEqual,
	Frequency,
	newAccountStrategy,
	newStrategy,
	Order,
	Strategy,
	StrategyDailyOrdersKey,
	StrategyFlow,
	StrategyKey,
	updatedNow,
	welcomeFlow
} from "@workspace/models"
import { dateToDay, dayToDate, getDate } from "minimal-time-helpers"

import { BinanceDatabase } from "./binance.js"
import { pathname } from "./locators.js"
import { PublicDatabase } from "./public.js"

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
		const { accountId } = this.accountKey
		const sourceStrategy = await this.readStrategy({
			strategyId,
			strategyKind
		})
		const targetStrategy = newStrategy({
			name,
			kind: strategyKind,
			accountId,
			frequency: sourceStrategy.frequency
		})
		const targetStrategyKey: StrategyKey = {
			strategyId: targetStrategy.id,
			strategyKind
		}
		await this.documentProvider.setItem(
			pathname.strategy(targetStrategyKey),
			targetStrategy
		)
		await this.documentProvider.setItem(
			pathname.strategyFlow(targetStrategyKey),
			welcomeFlow
		)
		const accountStrategy = newAccountStrategy({
			name,
			...targetStrategyKey
		})
		await this.insertAccountStrategiesItem(accountStrategy)
		return targetStrategyKey
	}

	async CreateBinanceApiConfig(arg: Input["CreateBinanceApiConfig"]) {
		await this.documentProvider.setItem(
			pathname.binanceApiConfig(this.accountKey),
			arg
		)
		return createdNow()
	}

	CreatePurchaseOrder(_arg: Input["CreatePurchaseOrder"]) {
		return Promise.resolve(null)
	}

	async CreateStrategy({ name, ...rest }: Input["CreateStrategy"]) {
		const { accountId } = this.accountKey
		const strategy = newStrategy({
			name,
			accountId,
			...rest
		})
		const strategyKey: StrategyKey = {
			strategyId: strategy.id,
			strategyKind: strategy.kind
		}
		await this.documentProvider.setItem(
			pathname.strategy(strategyKey),
			strategy
		)
		const accountStrategy = newAccountStrategy({ name, ...strategyKey })
		await this.insertAccountStrategiesItem(accountStrategy)
		return strategyKey
	}

	DeleteAccount() {
		return this.documentProvider.removeItem(
			pathname.account(this.accountKey)
		)
	}

	async DeleteBinanceApiConfig() {
		await this.documentProvider.removeItem(
			pathname.binanceApiConfig(this.accountKey)
		)
		return deletedNow()
	}

	async DeleteStrategy(strategyKey: Input["DeleteStrategy"]) {
		await this.deleteStrategy(strategyKey)
		await this.deleteStrategyFlow(strategyKey)
		return deletedNow()
	}

	async ReadAccountInfo() {
		const account = await this.readAccount()
		const subscription = await this.ReadSubscription()
		return { subscription, ...account }
	}

	async ReadAccountStrategies() {
		const data = await this.documentProvider.getItem<
			Output["ReadAccountStrategies"]
		>(pathname.accountStrategies(this.accountKey))
		return data ?? []
	}

	async ReadBinanceApiKey() {
		const data = await this.binanceDatabase.ReadBinanceApiConfig()
		if (!data) return null
		const { apiKey } = data
		return { apiKey }
	}

	async ReadStrategyOrders({
		start,
		end,
		...strategyKey
	}: Input["ReadStrategyOrders"]) {
		const { accountId } = this.accountKey
		const result: Output["ReadStrategyOrders"] = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const day = dateToDay(date)
			const orders = await this.readStrategyDailyOrders({
				day,
				accountId,
				...strategyKey
			})
			if (!orders) continue
			for (const order of orders) result.push(order)
			date = getDate(date).plusOne.day
		}
		return result
	}

	ReadSubscription() {
		return this.documentProvider.getItem<Output["ReadSubscription"]>(
			pathname.subscription(this.accountKey)
		)
	}

	async RenameAccount({ name }: Input["RenameAccount"]) {
		const account = await this.readAccount()
		const data: Account = {
			...account,
			name
		}
		return this.documentProvider.setItem(
			pathname.account(this.accountKey),
			data
		)
	}

	async RenameStrategy({
		name: newName,
		strategyId,
		strategyKind
	}: Input["RenameStrategy"]) {
		const { name: oldName, ...strategy } = await this.readStrategy({
			strategyId,
			strategyKind
		})
		if (newName === oldName) return updatedNow()
		await this.writeStrategy({ name: newName, ...strategy })
		const accountStrategies = await this.ReadAccountStrategies()
		const data = accountStrategies.map((item) => {
			if (item.strategyId !== strategyId) return item
			return { ...item, name: newName }
		})
		return this.writeAccountStrategies(data)
	}

	async SetAccountCountry({ country }: Input["SetAccountCountry"]) {
		const account = await this.readAccount()
		const data: Account = {
			...account,
			country
		}
		return this.documentProvider.setItem(
			pathname.account(this.accountKey),
			data
		)
	}

	async WriteAccountStrategiesItemSchedulings({
		schedulings,
		strategyId,
		strategyKind
	}: Input["WriteAccountStrategiesItemSchedulings"]) {
		const items = await this.ReadAccountStrategies()
		const data: AccountStrategy[] = []
		let suggestedFrequency: Frequency | undefined
		for (const item of items) {
			if (item.strategyId !== strategyId) {
				data.push(item)
				continue
			}
			data.push({ ...item, schedulings })
			// Use first frequency as `suggestedFrequency`.
			suggestedFrequency = schedulings[0]?.frequency
		}
		if (suggestedFrequency)
			await this.upsertStrategyFrequency({
				strategyId,
				strategyKind,
				frequency: suggestedFrequency
			})
		return this.documentProvider.setItem(
			pathname.accountStrategies(this.accountKey),
			data
		)
	}

	async WriteStrategyFlow({
		view,
		strategyId,
		strategyKind
	}: Input["WriteStrategyFlow"]) {
		return this.writeStrategyFlow({
			strategyId,
			strategyKind,
			view,
			...updatedNow()
		})
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
		const items = await this.ReadAccountStrategies()
		const subscription = await this.ReadSubscription()
		const newItems = accountStrategiesModifier.insertItem(
			items,
			item,
			subscription?.plan
		)
		await this.documentProvider.setItem(
			pathname.accountStrategies({ accountId }),
			newItems
		)
	}

	async readAccount() {
		const { accountId } = this.accountKey
		const account = await this.documentProvider.getItem<Account>(
			pathname.account({ accountId })
		)
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

	async readStrategyDailyOrders(
		arg: StrategyDailyOrdersKey
	): Promise<Order[]> {
		const data = await this.documentProvider.getItem<Order[] | null>(
			pathname.strategyDailyOrders(arg)
		)
		return data ?? []
	}

	async readStrategyFlow(strategyKey: StrategyKey) {
		const data = await this.publicDatabase.ReadStrategyFlow(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "StrategyFlow",
				...strategyKey
			})
		return data
	}

	writeAccountStrategies(data: AccountStrategy[]) {
		return this.documentProvider.setItem(
			pathname.accountStrategies(this.accountKey),
			data
		)
	}

	async upsertStrategyFrequency({
		frequency,
		...strategyKey
	}: { frequency: Frequency } & StrategyKey) {
		const strategy = await this.readStrategy(strategyKey)
		if (frequenciesAreEqual(frequency, strategy.frequency)) return
		await this.writeStrategy({ ...strategy, frequency })
	}

	async writeStrategy(strategy: Strategy) {
		const { accountId } = this.accountKey
		const { id: strategyId, kind: strategyKind } = strategy
		if (accountId !== strategy.accountId)
			throw new ErrorPermissionOnStrategyItem({
				type: "Strategy",
				action: "write",
				accountId,
				strategyId,
				strategyKind
			})
		return this.documentProvider.setItem(
			pathname.strategy({ strategyId, strategyKind }),
			strategy
		)
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
