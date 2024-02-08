import { Column, Columns } from "_/components/library"
import { StrategyErrorsTable } from "_/components/StrategyErrorsTable"
import { StrategyContext } from "_/contexts/Strategy"
import { useUserApi } from "_/hooks/useUserApi"
import { getDay, today } from "minimal-time-helpers"
import { FC, useContext, useEffect } from "react"

export const StrategyErrors: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	// TODO add day selector and use indexedDB to cache orders
	const numDays = 30

	const end = today()
	const start = getDay(end).minus(numDays).days
	// const dayInterval = { start, end }

	const READ = useUserApi.ReadStrategyErrors()

	const errors = READ.data

	useEffect(() => {
		if (!strategyKey) return
		if (READ.canRun)
			READ.request({
				end,
				start,
				...strategyKey
			})
	}, [READ, end, start, strategyKey])

	return (
		<Columns>
			<Column isNarrow>
				<StrategyErrorsTable errors={errors} />
			</Column>
		</Columns>
	)
}
