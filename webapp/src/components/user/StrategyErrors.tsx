import { Column, Columns, DayIntervalBox, OneColumn } from "_/components/library"
import { StrategyErrorsTable, StrategyErrorsTableProps } from "_/components/user/StrategyErrorsTable"
import { useReadStrategyErrors } from "_/hooks/user/api"
import { useStrategiesDayInterval } from "_/hooks/user/useStrategiesDayInterval"
import { StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export function StrategyErrors({ strategyKey }: { strategyKey: StrategyKey | undefined }) {
	const { min, max, start, setStart, end, setEnd } = useStrategiesDayInterval()

	const [errors, setErrors] = useState<StrategyErrorsTableProps["errors"]>()

	const { canRun, data, isDone, isPending, request, reset } = useReadStrategyErrors(strategyKey)

	const onClickUpdate = useCallback(() => {
		if (!strategyKey) return
		if (canRun) request({ end, start, ...strategyKey })
	}, [canRun, end, request, start, strategyKey])

	useEffect(() => {
		if (!isDone) return
		setErrors(data)
		reset()
	}, [isDone, data, reset])

	return (
		<>
			<OneColumn>
				<DayIntervalBox
					end={end}
					isLoading={isPending}
					max={max}
					min={min}
					onClickUpdate={onClickUpdate}
					setEnd={setEnd}
					setStart={setStart}
					start={start}
				/>
			</OneColumn>
			<Columns>
				<Column bulma="is-narrow">
					<StrategyErrorsTable errors={errors} />
				</Column>
			</Columns>
		</>
	)
}
