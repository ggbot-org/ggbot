import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyContext } from "_/contexts/Strategy"
import { useUserApi } from "_/hooks/useUserApi"
import { isOrders, Orders } from "@workspace/models"
import { DayInterval, getDay, today } from "minimal-time-helpers"
import { FC, useContext, useEffect, useMemo } from "react"

type Props = {
	numDays: number
}
export const StrategyProfits: FC<Props> = ({ numDays }) => {
	const { strategy } = useContext(StrategyContext)

	const dayInterval = useMemo<DayInterval>(() => {
		const end = today()
		const start = getDay(end).minus(numDays).days
		return { start, end }
	}, [numDays])

	const READ = useUserApi.ReadStrategyOrders()

	const orders: Orders = isOrders(READ.data) ? READ.data : []

	useEffect(() => {
		if (READ.canRun)
			READ.request({
				strategyId: strategy.id,
				strategyKind: strategy.kind,
				...dayInterval
			})
	}, [READ, dayInterval, strategy])

	return <ProfitSummary dayInterval={dayInterval} orders={orders} />
}
