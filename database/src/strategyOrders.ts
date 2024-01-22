import { UserApiDataProviderOperation as Operation } from "@workspace/api"
import { dateToDay, dayToDate, getDate } from "minimal-time-helpers"

import { readStrategyDailyOrders } from "./strategyDailyOrders.js"

export const readStrategyOrders: Operation["ReadStrategyOrders"] = async ({
	start,
	end,
	...key
}) => {
	const result: Awaited<ReturnType<Operation["ReadStrategyOrders"]>> = []
	let date = dayToDate(start)
	while (date <= dayToDate(end)) {
		const day = dateToDay(date)
		const orders = await readStrategyDailyOrders({ day, ...key })
		if (!orders) continue
		for (const order of orders) result.push(order)
		date = getDate(date).plusOne.day
	}
	return result
}
