import {
	DocumentProviderLevel3,
	ExecutorAction,
	ExecutorActionInput as Input,
	ExecutorActionOutput as Output
} from "@workspace/api"
import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	AccountKey,
	AccountStrategy,
	Order,
	StrategyDailyOrdersKey,
	StrategyScheduling
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

	async SuspendAccountStrategyScheduling({
		accountId,
		strategyId,
		schedulingId
	}: Input["SuspendAccountStrategyScheduling"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = items.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							({ status, ...scheduling }) => ({
								...scheduling,
								status:
									schedulingId === scheduling.id
										? "suspended"
										: status
							})
					  )
					: item.schedulings
		}))
		await this.writeAccountStrategies({ accountId }, data)
	}

	async SuspendAccountStrategySchedulings({
		accountId,
		strategyId
	}: Input["SuspendAccountStrategySchedulings"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = items.map<AccountStrategy>((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							({ status: _status, ...scheduling }) => ({
								...scheduling,
								status: "suspended"
							})
					  )
					: item.schedulings
		}))
		await this.writeAccountStrategies({ accountId }, data)
	}

	async SuspendAccountStrategiesSchedulings({
		accountId
	}: Input["SuspendAccountStrategiesSchedulings"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = items.map<AccountStrategy>((item) => ({
			...item,
			schedulings: item.schedulings.map<StrategyScheduling>(
				({ status: _status, ...scheduling }) => ({
					...scheduling,
					status: "suspended"
				})
			)
		}))
		await this.writeAccountStrategies({ accountId }, data)
	}

	async UpdateAccountStrategySchedulingMemory({
		accountId,
		strategyId,
		schedulingId,
		memory
	}: Input["UpdateAccountStrategySchedulingMemory"]) {
		const items = await this.ReadAccountStrategies({ accountId })
		const data = items.map<AccountStrategy>((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							(scheduling) => ({
								...scheduling,
								memory:
									schedulingId === scheduling.id
										? memory
										: scheduling.memory
							})
					  )
					: item.schedulings
		}))
		await this.writeAccountStrategies({ accountId }, data)
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

	writeAccountStrategies(arg: AccountKey, data: AccountStrategy[]) {
		return this.documentProvider.setItem(
			pathname.accountStrategies(arg),
			data
		)
	}
}
