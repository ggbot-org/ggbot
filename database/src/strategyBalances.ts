import { UserApiDataProviderOperation as Operation } from "@workspace/api"
import { dateToDay, dayToDate, getDate } from "minimal-time-helpers"

import { readStrategyDailyBalanceChanges } from "./strategyDailyBalanceChanges.js"

export const readStrategyBalances: Operation["ReadStrategyBalances"] = async ({
	start,
	end,
	...key
}) => {
	const result: Awaited<ReturnType<Operation["ReadStrategyBalances"]>> = []
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
