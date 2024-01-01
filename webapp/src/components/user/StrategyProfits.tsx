import { Columns, OneColumn } from "_/components/library"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyOrders } from "_/components/StrategyOrders"
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
		<>
			<Columns>
				<OneColumn>
					<ProfitSummary
						orders={orders}
						dayInterval={dayInterval}
						strategyKind={strategyKind}
					/>
				</OneColumn>
			</Columns>

			<Columns>
				<OneColumn>
					<StrategyOrders orders={orders} />
				</OneColumn>
			</Columns>
		</>
	)
}
