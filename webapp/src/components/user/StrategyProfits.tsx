import { StrategyProfits as _StrategyProfits } from "_/components/StrategyProfits"
import { StrategyContext } from "_/contexts/Strategy"
import { useUserApi } from "_/hooks/useUserApi"
import { getDay, today } from "minimal-time-helpers"
import { FC, useContext, useEffect } from "react"

export const StrategyProfits: FC = () => {
	const { strategyKey, strategyKind } = useContext(StrategyContext)

	// TODO add day selector and use indexedDB to cache orders
	const numDays = 30

	const end = today()
	const start = getDay(end).minus(numDays).days
	const dayInterval = { start, end }

	const READ = useUserApi.ReadStrategyOrders()

	const orders = READ.data

	useEffect(() => {
		if (!strategyKey) return
		if (READ.canRun)
			READ.request({
				end,
				start,
				...strategyKey
			})
	}, [READ, end, start, strategyKey])

	return (
		<_StrategyProfits
			dayInterval={dayInterval}
			orders={orders}
			strategyKind={strategyKind}
		/>
	)
}
