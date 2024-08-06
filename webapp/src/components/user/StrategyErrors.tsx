import { Column, Columns, DayIntervalBox, OneColumn } from "_/components/library"
import { StrategyErrorsTable, StrategyErrorsTableProps } from "_/components/StrategyErrorsTable"
import { useReadStrategyErrors } from "_/hooks/user/api"
import { useStrategiesDayInterval } from "_/hooks/user/useStrategiesDayInterval"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useCallback, useEffect, useState } from "react"

export function StrategyErrors() {
	const { strategyKey } = useStrategyKey()

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
			<Columns>
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
			</Columns>
			<Columns>
				<Column bulma="is-narrow">
					<StrategyErrorsTable errors={errors} />
				</Column>
			</Columns>
		</>
	)
}
