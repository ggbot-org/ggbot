import {
	Column,
	Columns,
	DailyIntervalBox,
	OneColumn
} from "_/components/library"
import {
	StrategyErrorsTable,
	StrategyErrorsTableProps
} from "_/components/StrategyErrorsTable"
import { useReadStrategyErrors } from "_/hooks/user/api"
import { useDailyInterval } from "_/hooks/user/useDailyInterval"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useCallback, useEffect, useState } from "react"

export function StrategyErrors() {
	const { strategyKey } = useStrategyKey()

	const { min, max, start, setStart, end, setEnd } = useDailyInterval()

	const [errors, setErrors] = useState<StrategyErrorsTableProps["errors"]>()

	const READ = useReadStrategyErrors(strategyKey)

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
		setErrors(READ.data)
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
						setStart={setStart}
						setEnd={setEnd}
						end={end}
						onClickUpdate={onClickUpdate}
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
