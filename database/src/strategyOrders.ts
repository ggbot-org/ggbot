import { ReadStrategyOrders } from "@ggbot2/models"
import { dateToDay, dayToDate, getDate } from "@ggbot2/time"

import { readStrategyDailyOrders } from "./strategyDailyOrders.js"

export const readStrategyOrders: ReadStrategyOrders = async ({
	start,
	end,
	...key
}) => {
	const result: Awaited<ReturnType<ReadStrategyOrders>> = []
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
