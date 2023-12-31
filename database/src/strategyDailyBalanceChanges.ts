import {
	AppendStrategyDailyBalanceChanges,
	ReadStrategyDailyBalanceChanges
} from "@workspace/models"

import { READ_ARRAY, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readStrategyDailyBalanceChanges: ReadStrategyDailyBalanceChanges =
	(arg) =>
		READ_ARRAY<ReadStrategyDailyBalanceChanges>(
			pathname.strategyDailyBalanceChanges(arg)
		)

export const appendStrategyDailyBalanceChanges: AppendStrategyDailyBalanceChanges =
	async ({ items, ...key }) => {
		const currentItems = await readStrategyDailyBalanceChanges(key)
		const data = currentItems ? [...currentItems, ...items] : items
		return await UPDATE(pathname.strategyDailyBalanceChanges(key), data)
	}
