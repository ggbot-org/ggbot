import {
	Column,
	Columns,
	DailyIntervalBox,
	OneColumn
} from "_/components/library"
import { ProfitSummary, ProfitSummaryProps } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { useReadStrategyOrders } from "_/hooks/user/api"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { getDay, today } from "minimal-time-helpers"
import { useCallback, useEffect, useState } from "react"

export function StrategyProfits() {
	const strategyKey = useStrategyKey()
	const strategyKind = strategyKey?.strategyKind

	// TODO use indexedDB to cache orders
	const numDays = 30

	const [start, setStart] = useState(getDay(today()).minus(numDays).days)
	const [end, setEnd] = useState(today())

	const [orders, setOrders] = useState<ProfitSummaryProps["orders"]>()

	const dayInterval = { start, end }

	const READ = useReadStrategyOrders()

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
