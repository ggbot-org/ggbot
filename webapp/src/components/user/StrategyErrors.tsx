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
import { StrategyContext } from "_/contexts/Strategy"
import { useReadStrategyErrors } from "_/hooks/user/api"
import { getDay, today } from "minimal-time-helpers"
import { useCallback, useContext, useEffect, useState } from "react"

export function StrategyErrors() {
	const { strategyKey } = useContext(StrategyContext)

	// TODO use indexedDB to cache errors
	const numDays = 30

	const [start, setStart] = useState(getDay(today()).minus(numDays).days)
	const [end, setEnd] = useState(today())

	const [errors, setErrors] = useState<StrategyErrorsTableProps["errors"]>()

	const READ = useReadStrategyErrors()

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
