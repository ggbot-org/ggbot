import {
	Column,
	Columns,
	DailyIntervalBox,
	OneColumn
} from "_/components/library"
import { ProfitSummary, ProfitSummaryProps } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { StrategyContext } from "_/contexts/Strategy"
import { useUserApi } from "_/hooks/userApi"
import { getDay, today } from "minimal-time-helpers"
import { useCallback, useContext, useEffect, useState } from "react"

export function StrategyProfits() {
	const { strategyKey, strategyKind } = useContext(StrategyContext)

	// TODO use indexedDB to cache orders
	const numDays = 30

	const [start, setStart] = useState(getDay(today()).minus(numDays).days)
	const [end, setEnd] = useState(today())

	const [orders, setOrders] = useState<ProfitSummaryProps["orders"]>()

	const dayInterval = { start, end }

	const READ = useUserApi.ReadStrategyOrders()

	const onClickUpdate = useCallback(() => {
		if (!strategyKey) return
		if (READ.canRun)
			READ.request({
				end,
				start,
				...strategyKey
			})
	}, [READ, end, start, strategyKey])

	useEffect(() => {
		if (!READ.isDone) return
		setOrders(READ.data)
		READ.reset()
	}, [READ])

	return (
		<>
			<Columns>
				<OneColumn>
					<DailyIntervalBox
						isLoading={READ.isPending}
						start={start}
						end={end}
						setStart={setStart}
						setEnd={setEnd}
						onClickUpdate={onClickUpdate}
					/>
				</OneColumn>
			</Columns>

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
				<Column bulma="is-narrow">
					<StrategyOrdersTable orders={orders} />
				</Column>
			</Columns>
		</>
	)
}
