import { DocumentProviderLevel3, ExecutorAction, ExecutorActionInput as Input, ExecutorActionOutput as Output } from "@workspace/api"
import { AccountDailyKey, AccountDailyOrder, AccountKey, accountStrategiesModifier, AccountStrategy, AccountStrategyDailyKey, BalanceEvent, Order, StrategyError } from "@workspace/models"

import { dirnameDelimiter, dirnamePrefix, locatorToItemKey, pathname } from "./locators.js"

export class ExecutorDatabase implements ExecutorAction {
	documentProvider: DocumentProviderLevel3

	constructor(documentProvider: DocumentProviderLevel3) {
		this.documentProvider = documentProvider
	}

	async AppendAccountBalanceEvent({ item, ...key }: Input["AppendAccountBalanceEvent"]) {
		const currentItems = await this.readAccountDailyBalanceEvents(key)
		const data = [...currentItems, item]
		await this.documentProvider.setItem(pathname.accountDailyBalanceEvents(key), data)
	}

	async AppendAccountDailyOrders({ items, ...key }: Input["AppendAccountDailyOrders"]) {
		const currentItems = await this.readAccountDailyOrders(key)
		const data = [...currentItems, ...items]
		await this.documentProvider.setItem(pathname.accountDailyOrders(key), data)
	}

	async AppendStrategyDailyErrors({ items, ...key }: Input["AppendStrategyDailyErrors"]) {
		const currentItems = await this.readStrategyDailyErrors(key)
		const data = [...currentItems, ...items]
		await this.documentProvider.setItem(pathname.strategyDailyErrors(key), data)
	}

	async AppendStrategyDailyOrders({ items, ...key }: Input["AppendStrategyDailyOrders"]) {
		const currentItems = await this.readStrategyDailyOrders(key)
		const data = [...currentItems, ...items]
		await this.documentProvider.setItem(pathname.strategyDailyOrders(key), data)
	}

	async ListAccountKeys(args: Input["ListAccountKeys"]) {
		const { keys: locators, ...rest } = await this.documentProvider.listItems({
			prefix: `${dirnamePrefix.account}${dirnameDelimiter}`,
			...args
		})
		return {
			accountKeys: locators.reduce<AccountKey[]>((list, locator) => {
				const itemKey = locatorToItemKey.account(locator)
				return itemKey ? list.concat(itemKey) : list
			}, []),
			...rest
		}
	}

	async ReadAccountStrategies(arg: Input["ReadAccountStrategies"]) {
		const data = await this.documentProvider.getItem<Output["ReadAccountStrategies"]>(pathname.accountStrategies(arg))
		if (!data) return []
		return data
	}

	ReadAccount(arg: Input["ReadAccount"]) {
		return this.documentProvider.getItem<Output["ReadAccount"]>(pathname.account(arg))
	}

	ReadSubscription(arg: Input["ReadSubscription"]) {
		return this.documentProvider.getItem<Output["ReadSubscription"]>(pathname.subscription(arg))
	}

	async SuspendAccountStrategyScheduling({ accountId, strategyId, schedulingId }: Input["SuspendAccountStrategyScheduling"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = accountStrategiesModifier.suspendScheduling(items, strategyId, schedulingId)
		await this.writeAccountStrategies({ accountId }, data)
	}

	async SuspendAccountStrategySchedulings({ accountId, strategyId }: Input["SuspendAccountStrategySchedulings"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = accountStrategiesModifier.suspendStrategySchedulings(items, strategyId)
		await this.writeAccountStrategies({ accountId }, data)
	}

	async UpdateAccountStrategySchedulingMemory({ accountId, strategyId, schedulingId, memory }: Input["UpdateAccountStrategySchedulingMemory"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = accountStrategiesModifier.updateSchedulingMemory(items, strategyId, schedulingId, memory)
		await this.writeAccountStrategies({ accountId }, data)
	}

	async readAccountDailyBalanceEvents(arg: AccountDailyKey) {
		const data = await this.documentProvider.getItem<BalanceEvent[]>(pathname.accountDailyBalanceEvents(arg))
		return data ?? []
	}

	async readAccountDailyOrders(arg: AccountDailyKey) {
		const data = await this.documentProvider.getItem<AccountDailyOrder[]>(pathname.accountDailyOrders(arg))
		return data ?? []
	}

	async readStrategyDailyErrors(arg: AccountStrategyDailyKey) {
		const data = await this.documentProvider.getItem<StrategyError[]>(pathname.strategyDailyErrors(arg))
		return data ?? []
	}

	async readStrategyDailyOrders(arg: AccountStrategyDailyKey) {
		const data = await this.documentProvider.getItem<Order[]>(pathname.strategyDailyOrders(arg))
		return data ?? []
	}

	writeAccountStrategies(arg: AccountKey, data: AccountStrategy[]) {
		return this.documentProvider.setItem(pathname.accountStrategies(arg), data)
	}
}
