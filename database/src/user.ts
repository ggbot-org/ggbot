import {
	UserApiInput as Input,
	UserApiOutput as Output,
	UserApiActionType
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	AccountKey,
	AccountStrategy,
	ApiDataProvider,
	DocumentProviderLevel2,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	Strategy,
	StrategyFlow,
	StrategyKey,
	accountStrategiesModifier,
	createdNow,
	deletedNow,
	newAccountStrategy,
	newStrategy,
	updatedNow
} from "@workspace/models"
import { PublicDatabase } from "./public.js"
import { pathname } from "./locators.js"

export class UserDatabase implements ApiDataProvider<UserApiActionType> {
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

	ReadAccountStrategies(): Promise<Output["ReadAccountStrategies"]> {
		return this.documentProvider.getItem<Output["ReadAccountStrategies"]>(
			pathname.accountStrategies(this.accountKey)
		)
	}

	async ReadSubscription(): Promise<Output["ReadSubscription"]> {
		return this.documentProvider.getItem(
			pathname.subscription(this.accountKey)
		)
	}

	async WriteStrategyFlow({
		view,
		strategyId,
		strategyKind
	}: Input["WriteStrategyFlow"]): Promise<Output["WriteStrategyFlow"]> {
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

	private async deleteStrategyFlow(strategyKey: StrategyKey) {
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

	private async insertAccountStrategiesItem(item: AccountStrategy) {
		const { accountId } = this.accountKey
		const items = await this.ReadAccountStrategies()
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

	private async readStrategy(strategyKey: StrategyKey): Promise<Strategy> {
		const data = await this.publicDatabase.readStrategy(strategyKey)
		if (!data)
			throw new ErrorStrategyItemNotFound({
				type: "Strategy",
				...strategyKey
			})
		return data
	}

	private async readStrategyFlow(
		strategyKey: StrategyKey
	): Promise<StrategyFlow> {
		const data = await this.publicDatabase.readStrategyFlow(strategyKey)
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
