import { Message, Table } from "_/components/library"
import { timeFormat } from "_/i18n/formats"
import { StrategyError } from "@workspace/models"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Row = {
	whenCreated: string
	error: string
}

export type StrategyErrorsTableProps = {
	errors: StrategyError[] | undefined
}

export const StrategyErrorsTable: FC<StrategyErrorsTableProps> = ({
	errors
}) => {
	const { formatDate } = useIntl()

	const rows: Row[] = []
	if (errors)
		for (const { whenCreated, error } of errors)
			rows.push({
				whenCreated: formatDate(whenCreated, timeFormat),
				error: JSON.stringify(error)
			})

	if (!errors) return null

	if (errors.length === 0)
		return (
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
