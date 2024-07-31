import {
	Column,
	Columns,
	DailyIntervalBox,
	OneColumn
} from "_/components/library"
import { ProfitSummary, ProfitSummaryProps } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { useReadStrategyOrders } from "_/hooks/user/api"
import { useDailyInterval } from "_/hooks/user/useDailyInterval"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useCallback, useEffect, useState } from "react"

export function StrategyProfits() {
	const strategyKey = useStrategyKey()
	const strategyKind = strategyKey?.strategyKind

	const { min, max, start, setStart, end, setEnd } = useDailyInterval()

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
						min={min}
						max={max}
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
