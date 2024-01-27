// TODO remove this file

// export const readStrategyBalances: Operation["ReadStrategyBalances"] = async ({
// 	start,
// 	end,
// 	...key
// }) => {
// 	const result: Awaited<ReturnType<Operation["ReadStrategyBalances"]>> = []
// 	let date = dayToDate(start)
// 	while (date <= dayToDate(end)) {
// 		const day = dateToDay(date)
// 		const data =
// 			(await readStrategyDailyBalanceChanges({ day, ...key })) ?? []
// 		result.push({ day, data })
// 		date = getDate(date).plusOne.day
// 	}
// 	return result
// }
