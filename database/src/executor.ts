import {
	DocumentProviderLevel3,
	ExecutorAction,
	ExecutorActionInput as Input
} from "@workspace/api"
import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	AccountStrategy,
	Order,
	StrategyDailyOrdersKey
} from "@workspace/models"

import { pathname } from "./locators.js"

export class ExecutorDatabase implements ExecutorAction {
	documentProvider: DocumentProviderLevel3

	constructor(documentProvider: ExecutorDatabase["documentProvider"]) {
		this.documentProvider = documentProvider
	}

	async AppendAccountDailyOrders({
		items,
		...key
	}: Input["AppendAccountDailyOrders"]) {
		const currentItems = await this.readAccountDailyOrders(key)
		const data = [...currentItems, ...items]
		await this.documentProvider.setItem(
			pathname.accountDailyOrders(key),
			data
		)
	}

	async AppendStrategyDailyOrders({
		items,
		...key
	}: Input["AppendStrategyDailyOrders"]) {
		const currentItems = await this.readAccountDailyOrders(key)
		const data = [...currentItems, ...items]
		await this.documentProvider.setItem(
			pathname.strategyDailyOrders(key),
			data
		)
	}

	ListAccountKeys() {
		const items: Array<Readonly<{ accountId: string }>> = []
		return Promise.resolve(items)
	}

	ReadAccountStrategies(_arg: Input["ReadAccountStrategies"]) {
		const items: AccountStrategy[] = []
		return Promise.resolve(items)
	}

	ReadSubscription(_arg: Input["ReadSubscription"]) {
		return Promise.resolve(null)
	}

	SuspendAccountStrategyScheduling(
		_arg: Input["SuspendAccountStrategyScheduling"]
	) {
		return Promise.resolve()
	}

	SuspendAccountStrategySchedulings(
		_arg: Input["SuspendAccountStrategySchedulings"]
	) {
		return Promise.resolve()
	}

	SuspendAccountStrategiesSchedulings(
		_arg: Input["SuspendAccountStrategiesSchedulings"]
	) {
		return Promise.resolve()
	}

	UpdateAccountStrategySchedulingMemory(
		_arg: Input["UpdateAccountStrategySchedulingMemory"]
	) {
		return Promise.resolve()
	}

	async readAccountDailyOrders(arg: AccountDailyOrdersKey) {
		const data = await this.documentProvider.getItem<AccountDailyOrder[]>(
			pathname.accountDailyOrders(arg)
		)
		return data ?? []
	}

	async readStrategyDailyOrders(arg: StrategyDailyOrdersKey) {
		const data = await this.documentProvider.getItem<Order[]>(
			pathname.accountDailyOrders(arg)
		)
		return data ?? []
	}
}
