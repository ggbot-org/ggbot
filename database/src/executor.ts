import {
	DocumentProviderLevel2,
	ExecutorAction,
	ExecutorActionInput as Input
} from "@workspace/api"
import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	Order,
	StrategyDailyOrdersKey
} from "@workspace/models"

import { pathname } from "./locators.js"

export class ExecutorDatabase implements ExecutorAction {
	documentProvider: DocumentProviderLevel2

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
