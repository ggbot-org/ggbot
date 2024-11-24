import { Message, Table } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { timeFormat } from '_/i18n/formats'
import { useIntl } from '_/i18n/hooks'
import { StrategyError } from '@workspace/models'

type Row = {
	whenCreated: string
	error: string
}

export type StrategyErrorsTableProps = {
	errors: StrategyError[] | undefined
}

export function StrategyErrorsTable({ errors }: StrategyErrorsTableProps) {
	const { formatDate } = useIntl()

	const rows: Row[] = []
	if (errors) for (const { whenCreated, error } of errors) rows.push({
		whenCreated: formatDate(whenCreated, timeFormat),
		error: JSON.stringify(error)
	})

	if (!errors) return null

	if (errors.length === 0) return (
		<Message>
			<FormattedMessage id="StrategyErrors.noError" />
		</Message>
	)

	return (
		<Table>
			<thead>
				<tr>
					<th>
						<FormattedMessage id="StrategyErrors.whenCreated" />
					</th>
					<th>
						<FormattedMessage id="StrategyErrors.detail" />
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map(({ whenCreated, error }) => (
					<tr key={whenCreated}>
						<td>{whenCreated}</td>
						<td>{error}</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}
