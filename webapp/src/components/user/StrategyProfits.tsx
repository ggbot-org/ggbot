import { DayIntervalBox } from "_/components/DayIntervalBox"
import { Column, OneColumn } from "_/components/library"
import { ProfitSummary, ProfitSummaryProps } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { useReadStrategyOrders } from "_/hooks/user/api"
import { useStrategiesDayInterval } from "_/hooks/user/useStrategiesDayInterval"
import { StrategyKey } from "@workspace/models"
import { useEffect, useState } from "react"

export function StrategyProfits({ strategyKey }: { strategyKey: StrategyKey | undefined }) {
	const { min, max, start, setStart, end, setEnd } = useStrategiesDayInterval()

	const [orders, setOrders] = useState<ProfitSummaryProps["orders"]>()

	const dayInterval = { start, end }

	const { canRun, request, isDone, isPending, reset, data } = useReadStrategyOrders()

	useEffect(() => {
		if (!isDone) return
		setOrders(data)
		reset()
	}, [isDone, data, reset])

	if (!strategyKey) return null

	return (
		<>
			<OneColumn>
				<DayIntervalBox
					end={end}
					isLoading={isPending}
					max={max}
					min={min}
					onClickUpdate={() => {
						if (canRun) request({ end, start, ...strategyKey })
					}}
					setEnd={setEnd}
					setStart={setStart}
					start={start}
				/>
			</OneColumn>
			<OneColumn>
				<ProfitSummary
					dayInterval={dayInterval}
					orders={orders}
					strategyKind={strategyKey.strategyKind}
				/>
			</OneColumn>
			<Column bulma="is-narrow">
				<StrategyOrdersTable orders={orders} />
			</Column>
		</>
	)
}
