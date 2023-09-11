import { ReadStrategyBalances } from "@workspace/models"
import { dateToDay, dayToDate, getDate } from "minimal-time-helpers"

import { readStrategyDailyBalanceChanges } from "./strategyDailyBalanceChanges.js"

export const readStrategyBalances: ReadStrategyBalances = async ({
	start,
	end,
	...key
}) => {
	const result: Awaited<ReturnType<ReadStrategyBalances>> = []
	let date = dayToDate(start)
	while (date <= dayToDate(end)) {
		const day = dateToDay(date)
		const data =
			(await readStrategyDailyBalanceChanges({ day, ...key })) ?? []
		result.push({ day, data })
		date = getDate(date).plusOne.day
	}
	return result
}
