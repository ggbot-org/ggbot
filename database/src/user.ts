import {
	DocumentProviderLevel2,
	UserDatabaseAction,
	UserDatabaseActionInput as Input,
	UserDatabaseActionOutput as Output
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	AccountDailyKey,
	AccountKey,
	accountStrategiesModifier,
	AccountStrategy,
	AccountStrategyDailyKey,
	BalanceEvent,
	createdNow,
	deletedNow,
	ErrorAccountItemNotFound,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	frequenciesAreEqual,
	Frequency,
	newAccountStrategy,
	newStrategy,
	newStrategyFlow,
	Order,
	Strategy,
	StrategyError,
	StrategyFlow,
	StrategyKey,
	updatedNow,
	welcomeFlow
} from "@workspace/models"
import { dateToDay, dayToDate, getDate } from "minimal-time-helpers"

import { BinanceDatabase } from "./binance.js"
import { pathname } from "./locators.js"
import { PublicDatabase } from "./public.js"

export class UserDatabase implements UserDatabaseAction {
	// TODO cache should be attached after to the instance, to be reused
	readonly strategyAccountIdCache = new CacheMap<Account["id"]>()

	private accountKey: AccountKey
	private documentProvider: DocumentProviderLevel2
	private binanceDatabase: BinanceDatabase
	private publicDatabase: PublicDatabase

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
		const sourceStrategyFlow = await this.readStrategyFlow({
			strategyId,
			strategyKind
		})
		await this.documentProvider.setItem(
			pathname.strategyFlow(targetStrategyKey),
			sourceStrategyFlow
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

	CreatePurchaseOrder() {
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
		await this.documentProvider.setItem(
			pathname.strategyFlow(strategyKey),
			newStrategyFlow({ view: welcomeFlow })
		)
		const accountStrategy = newAccountStrategy({ name, ...strategyKey })
		await this.insertAccountStrategiesItem(accountStrategy)
		return strategyKey
	}

	/**
	 * Delete account related files.
	 *
	 * @remarks
	 * It keeps account related file in `emailAccount/` in case a user wants to
	 * recover a deleted account, it will be possible to do that if same email
	 * is used.
	 */
	async DeleteAccount() {
		await this.DeleteBinanceApiConfig()
		await this.documentProvider.removeItem(
			pathname.account(this.accountKey)
		)
		return deletedNow()
	}

	async DeleteBinanceApiConfig() {
		await this.documentProvider.removeItem(
			pathname.binanceApiConfig(this.accountKey)
		)
		return deletedNow()
	}

	/**
	 * Delete strategy from `accountStrategies` list.
	 *
	 * @remarks
	 * The `strategy` file is **not** deleted: it may be referenced by some
	 * order or other data.
	 */
	async DeleteStrategy(strategyKey: Input["DeleteStrategy"]) {
		await this.deleteAccountStrategiesItem(strategyKey.strategyId)
		await this.deleteStrategyFlow(strategyKey)
		return deletedNow()
	}

	async ReadAccountInfo() {
		const account = await this.readAccount()
		const subscription = await this.ReadSubscription()
		return { subscription, ...account }
	}

	async ReadBalances({ start, end }: Input["ReadBalances"]) {
		const result: Output["ReadBalances"] = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readAccountDailyBalanceEvents({
				day: dateToDay(date),
				...this.accountKey
			})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	async ReadBinanceApiKey() {
		const data = await this.binanceDatabase.ReadBinanceApiConfig()
		if (!data) return null
		const { apiKey } = data
		return { apiKey }
	}

	async ReadStrategies() {
		const data = await this.documentProvider.getItem<
			Output["ReadStrategies"]
		>(pathname.accountStrategies(this.accountKey))
		return data ?? []
	}

	async ReadStrategyErrors({
		start,
		end,
		...strategyKey
	}: Input["ReadStrategyErrors"]) {
		const result: Output["ReadStrategyErrors"] = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readStrategyDailyErrors({
				day: dateToDay(date),
				...this.accountKey,
				...strategyKey
			})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	async ReadStrategyOrders({
		start,
		end,
		...strategyKey
	}: Input["ReadStrategyOrders"]) {
		const result: Output["ReadStrategyOrders"] = []
		let date = dayToDate(start)
		while (date <= dayToDate(end)) {
			const dailyResult = await this.readStrategyDailyOrders({
				day: dateToDay(date),
				...this.accountKey,
				...strategyKey
			})
			if (!dailyResult) continue
			result.push(...dailyResult)
			date = getDate(date).plusOne.day
		}
		return result
	}

	ReadSubscription() {
		return this.documentProvider.getItem<Output["ReadSubscription"]>(
			pathname.subscription(this.accountKey)
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
		const accountStrategies = await this.ReadStrategies()
		const data = accountStrategies.map((item) => {
			if (item.strategyId !== strategyId) return item
			return { ...item, name: newName }
		})
		return this.writeAccountStrategies(data)
	}

	async WriteAccountStrategiesItemSchedulings({
		schedulings,
		strategyId,
		strategyKind
	}: Input["WriteAccountStrategiesItemSchedulings"]) {
		const items = await this.ReadStrategies()
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
		const items = await this.ReadStrategies()
		const subscription = await this.ReadSubscription()
		const newItems = accountStrategiesModifier.insertAccountStrategy(
			items,
			item,
			subscription?.plan
		)
		await this.documentProvider.setItem(
			pathname.accountStrategies({ accountId }),
			newItems
		)
	}

	async deleteAccountStrategiesItem(
		strategyId: AccountStrategy["strategyId"]
	) {
		const { accountId } = this.accountKey
		const items = await this.ReadStrategies()
		const newItems = accountStrategiesModifier.deleteAccountStrategy(
			items,
			strategyId
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

	async readAccountDailyBalanceEvents(
		arg: AccountDailyKey
	): Promise<BalanceEvent[]> {
		const data = await this.documentProvider.getItem<BalanceEvent[] | null>(
			pathname.accountDailyBalanceEvents(arg)
		)
		return data ?? []
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

	async readStrategyDailyErrors(
		arg: AccountStrategyDailyKey
	): Promise<StrategyError[]> {
		const data = await this.documentProvider.getItem<
			StrategyError[] | null
		>(pathname.strategyDailyErrors(arg))
		return data ?? []
	}

	async readStrategyDailyOrders(
		arg: AccountStrategyDailyKey
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
