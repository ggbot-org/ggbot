import {
	DocumentProviderLevel3,
	ExecutorAction,
	ExecutorActionInput as Input,
	ExecutorActionOutput as Output
} from "@workspace/api"
import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	Order,
	StrategyDailyOrdersKey
} from "@workspace/models"

import {
	dirnameDelimiter,
	dirnamePrefix,
	locatorToItemKey,
	pathname
} from "./locators.js"

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

	async ListAccountKeys() {
		const Prefix = dirnamePrefix.account + dirnameDelimiter
		const itemLocators = await this.documentProvider.listItems(Prefix)
		return itemLocators.reduce<Output["ListAccountKeys"]>((list, item) => {
			const itemKey = locatorToItemKey.account(item)
			return itemKey ? list.concat(itemKey) : list
		}, [])
	}

	async ReadAccountStrategies(arg: Input["ReadAccountStrategies"]) {
		const data = await this.documentProvider.getItem<
			Output["ReadAccountStrategies"]
		>(pathname.accountStrategies(arg))
		if (!data) return []
		return data
	}

	ReadSubscription(arg: Input["ReadSubscription"]) {
		return this.documentProvider.getItem<Output["ReadSubscription"]>(
			pathname.subscription(arg)
		)
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
