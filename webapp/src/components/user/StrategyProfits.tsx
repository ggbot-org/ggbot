import { DayIntervalBox } from "_/components/DayIntervalBox"
import { Column, OneColumn } from "_/components/library"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { useReadStrategyOrders } from "_/hooks/user/api"
import { useStrategiesDayInterval } from "_/hooks/user/useStrategiesDayInterval"
import { StrategyKey } from "@workspace/models"

export function StrategyProfits({ strategyKey }: { strategyKey: StrategyKey | undefined }) {
	const { min, max, start, setStart, end, setEnd } = useStrategiesDayInterval()

	const dayInterval = { start, end }

	const { request, isPending, reset, data: orders } = useReadStrategyOrders()

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
						reset()
						request({ end, start, ...strategyKey })
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
