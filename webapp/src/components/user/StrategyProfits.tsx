import { Column, DayIntervalBox, OneColumn } from "_/components/library"
import { ProfitSummary, ProfitSummaryProps } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { useReadStrategyOrders } from "_/hooks/user/api"
import { useStrategiesDayInterval } from "_/hooks/user/useStrategiesDayInterval"
import { StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export function StrategyProfits({ strategyKey }: { strategyKey: StrategyKey | undefined }) {
	const { min, max, start, setStart, end, setEnd } = useStrategiesDayInterval()

	const [orders, setOrders] = useState<ProfitSummaryProps["orders"]>()

	const dayInterval = { start, end }

	const READ = useReadStrategyOrders(strategyKey)

	const onClickUpdate = useCallback(() => {
		if (!strategyKey) return
		if (READ.canRun) READ.request({ end, start, ...strategyKey })
	}, [READ, end, start, strategyKey])

	useEffect(() => {
		if (!READ.isDone) return
		setOrders(READ.data)
		READ.reset()
	}, [READ])

	return (
		<>
			<OneColumn>
				<DayIntervalBox
					end={end}
					isLoading={READ.isPending}
					max={max}
					min={min}
					onClickUpdate={onClickUpdate}
					setEnd={setEnd}
					setStart={setStart}
					start={start}
				/>
			</OneColumn>
			<OneColumn>
				<ProfitSummary
					dayInterval={dayInterval}
					orders={orders}
					strategyKind={strategyKey?.strategyKind}
				/>
			</OneColumn>
			<Column bulma="is-narrow">
				<StrategyOrdersTable orders={orders} />
			</Column>
		</>
	)
}
